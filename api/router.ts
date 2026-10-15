import { getServerSupabase, getStorageBucketName } from './_lib/supabase';
import { signToken, createAuthCookie, createClearAuthCookie } from './_lib/jwt';
import { authenticateRequest, sendJson, parseBody } from './_lib/response';

/**
 * Universal backend handler for all /api/* requests
 */
export async function handleApi(req: any, res: any) {
  // Extract path segments from Vercel query or URL
  let pathSegments: string[] = [];

  if (req.query?.path) {
    if (Array.isArray(req.query.path)) {
      pathSegments = req.query.path;
    } else if (typeof req.query.path === 'string') {
      pathSegments = req.query.path.split('/').filter(Boolean);
    }
  } else if (req.url) {
    const urlObj = new URL(req.url, 'http://localhost');
    const pathname = urlObj.pathname.replace(/^\/api\/?/, '');
    pathSegments = pathname.split('/').filter(Boolean);
  }

  const method = (req.method || 'GET').toUpperCase();
  const rootSegment = pathSegments[0] || '';
  const subSegment = pathSegments[1] || '';
  const thirdSegment = pathSegments[2] || '';

  try {
    // ------------------------------------------------------------------------
    // 1. HEALTH CHECK / ROOT
    // ------------------------------------------------------------------------
    if (pathSegments.length === 0 || rootSegment === 'health') {
      return sendJson(res, 200, {
        status: 'online',
        service: 'NovaSats On-Chain Backend API',
        timestamp: new Date().toISOString(),
      });
    }

    // ------------------------------------------------------------------------
    // 2. AUTHENTICATION (/api/auth/*)
    // ------------------------------------------------------------------------
    if (rootSegment === 'auth') {
      const supabase = getServerSupabase();

      // POST /api/auth/register
      if (subSegment === 'register' && method === 'POST') {
        const body = await parseBody(req);
        const { company_name, contact_name, email, password, phone, wallet_address } = body;

        if (!email || !password || !company_name) {
          return sendJson(res, 400, { error: 'Empresa, correo y contraseña son obligatorios.' });
        }

        // Check if supplier already exists
        const { data: existing } = await supabase
          .from('suppliers')
          .select('id')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();

        if (existing) {
          return sendJson(res, 409, { error: 'Ya existe un proveedor registrado con este correo electrónico.' });
        }

        const newSupplier = {
          company_name: company_name.trim(),
          contact_name: contact_name?.trim() || '',
          email: email.trim().toLowerCase(),
          password: password, // In production you can also bcrypt
          phone: phone?.trim() || '',
          wallet_address: wallet_address?.trim() || '',
          avatar_url: '',
          blobatar_identifier: `blobatar:v2:${encodeURIComponent(
            JSON.stringify({
              seed: company_name.trim(),
              expressionKey: 'happy',
              shapeKey: 'squircle',
              glowKey: 'amber',
              animMode: 'hover',
            })
          )}`,
        };

        const { data: inserted, error: insertErr } = await supabase
          .from('suppliers')
          .insert([newSupplier])
          .select()
          .single();

        if (insertErr || !inserted) {
          return sendJson(res, 500, { error: insertErr?.message || 'Error al crear la cuenta de proveedor.' });
        }

        // Auto-initialize commercial profile & default wallet
        try {
          await supabase.from('supplier_commercial_profiles').upsert({
            supplier_id: inserted.id,
            brand_name: inserted.company_name,
            commercial_activity: 'Comercio Web3 y Hardware',
            website_url: '',
            support_email: inserted.email,
            customer_phone: inserted.phone || '',
            whatsapp_number: inserted.phone || '',
            commercial_description: `Tienda oficial de ${inserted.company_name} en NovaSats.`,
          });

          if (inserted.wallet_address) {
            await supabase.from('supplier_wallets').upsert({
              supplier_id: inserted.id,
              wallet_address: inserted.wallet_address,
              network: 'EVM',
              label: 'Billetera Principal de Recaudación',
              is_primary: true,
            });
          }
        } catch (subErr) {
          console.warn('Initial sub-profiles setup notice:', subErr);
        }

        const token = signToken({
          sub: inserted.id,
          email: inserted.email,
          company_name: inserted.company_name,
        });

        const { password: _, ...cleanSupplier } = inserted;
        return sendJson(
          res,
          201,
          { success: true, supplier: cleanSupplier },
          { cookie: createAuthCookie(token) }
        );
      }

      // POST /api/auth/login
      if (subSegment === 'login' && method === 'POST') {
        const body = await parseBody(req);
        const { email, password } = body;

        if (!email || !password) {
          return sendJson(res, 400, { error: 'Correo y contraseña son requeridos.' });
        }

        const { data: user, error: findErr } = await supabase
          .from('suppliers')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();

        if (findErr || !user) {
          return sendJson(res, 401, { error: 'Proveedor no encontrado con este correo.' });
        }

        if (user.password !== password) {
          return sendJson(res, 401, { error: 'Contraseña incorrecta.' });
        }

        const token = signToken({
          sub: user.id,
          email: user.email,
          company_name: user.company_name,
        });

        const { password: _, ...cleanUser } = user;
        return sendJson(
          res,
          200,
          { success: true, supplier: cleanUser },
          { cookie: createAuthCookie(token) }
        );
      }

      // GET /api/auth/me
      if (subSegment === 'me' && method === 'GET') {
        const { supplier: authPayload, renewedCookie } = authenticateRequest(req);
        if (!authPayload) {
          return sendJson(res, 401, { authenticated: false, supplier: null });
        }

        const { data: user } = await supabase
          .from('suppliers')
          .select('id, email, company_name, phone, wallet_address, avatar_url, blobatar_identifier, created_at')
          .eq('id', authPayload.sub)
          .maybeSingle();

        if (!user) {
          return sendJson(
            res,
            401,
            { authenticated: false, supplier: null },
            { cookie: createClearAuthCookie() }
          );
        }

        return sendJson(
          res,
          200,
          { authenticated: true, supplier: user },
          { cookie: renewedCookie }
        );
      }

      // POST /api/auth/logout
      if (subSegment === 'logout' && method === 'POST') {
        return sendJson(
          res,
          200,
          { success: true, message: 'Sesión finalizada exitosamente.' },
          { cookie: createClearAuthCookie() }
        );
      }

      // POST /api/auth/change-password
      if (subSegment === 'change-password' && method === 'POST') {
        const { supplier: authPayload } = authenticateRequest(req);
        if (!authPayload) {
          return sendJson(res, 401, { error: 'No autorizado. Inicia sesión nuevamente.' });
        }

        const body = await parseBody(req);
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword || newPassword.length < 6) {
          return sendJson(res, 400, { error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
        }

        const { data: user } = await supabase
          .from('suppliers')
          .select('id, password')
          .eq('id', authPayload.sub)
          .single();

        if (!user || user.password !== currentPassword) {
          return sendJson(res, 400, { error: 'La contraseña actual no coincide.' });
        }

        const { error: updateErr } = await supabase
          .from('suppliers')
          .update({ password: newPassword, updated_at: new Date().toISOString() })
          .eq('id', authPayload.sub);

        if (updateErr) {
          return sendJson(res, 500, { error: 'Error al actualizar la contraseña.' });
        }

        // Rotate token with increased version to invalidate older sessions
        const rotatedToken = signToken({
          sub: authPayload.sub,
          email: authPayload.email,
          company_name: authPayload.company_name,
          v: (authPayload.v || 1) + 1,
        });

        return sendJson(
          res,
          200,
          { success: true, message: 'Contraseña actualizada con éxito.' },
          { cookie: createAuthCookie(rotatedToken) }
        );
      }

      return sendJson(res, 404, { error: 'Ruta de autenticación no encontrada.' });
    }

    // ------------------------------------------------------------------------
    // 3. CATALOG PRODUCTS (/api/products/*)
    // ------------------------------------------------------------------------
    if (rootSegment === 'products') {
      const supabase = getServerSupabase();

      // GET /api/products (Public with Edge Cache for Slow Internet)
      if (pathSegments.length === 1 && method === 'GET') {
        const { data, error } = await supabase
          .from('products')
          .select('*, suppliers(company_name, email, wallet_address, avatar_url)')
          .neq('status', 'archived')
          .order('created_at', { ascending: false });

        if (error) {
          return sendJson(res, 500, { error: error.message });
        }

        return sendJson(
          res,
          200,
          { success: true, products: data || [] },
          { cache: 'public-edge' }
        );
      }

      // GET /api/products/:id (Public with Edge Cache for Slow Internet)
      if (pathSegments.length === 2 && method === 'GET') {
        const productId = subSegment;

        const selectQuery = '*, suppliers(company_name, email, wallet_address, avatar_url), product_questions(*), product_reviews(*)';

        // Try primary UUID
        const { data: productById, error: errById } = await supabase
          .from('products')
          .select(selectQuery)
          .eq('id', productId)
          .maybeSingle();

        const formatDetail = (prod: any) => ({
          success: true,
          product: prod,
          questions: (prod.product_questions || []).sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ),
          reviews: (prod.product_reviews || []).sort(
            (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ),
        });

        if (productById && !errById) {
          return sendJson(
            res,
            200,
            formatDetail(productById),
            { cache: 'public-edge' }
          );
        }

        // Try SKU fallback
        const { data: productBySku } = await supabase
          .from('products')
          .select(selectQuery)
          .eq('sku', productId)
          .maybeSingle();

        if (productBySku) {
          return sendJson(
            res,
            200,
            formatDetail(productBySku),
            { cache: 'public-edge' }
          );
        }

        return sendJson(res, 404, { error: 'Producto no encontrado.' });
      }

      return sendJson(res, 404, { error: 'Ruta de productos no encontrada.' });
    }

    // ------------------------------------------------------------------------
    // 4. ORDERS & VOUCHERS (/api/orders/*)
    // ------------------------------------------------------------------------
    if (rootSegment === 'orders') {
      const supabase = getServerSupabase();

      // POST /api/orders (Checkout Submission)
      if (pathSegments.length === 1 && method === 'POST') {
        const body = await parseBody(req);
        const { order, items } = body;

        if (!order || !items || !Array.isArray(items) || items.length === 0) {
          return sendJson(res, 400, { error: 'Datos de la orden o artículos faltantes.' });
        }

        // 1. Insert order record
        const { data: newOrder, error: orderErr } = await supabase
          .from('orders')
          .insert([order])
          .select()
          .single();

        if (orderErr || !newOrder) {
          console.error('Order creation error:', orderErr);
          return sendJson(res, 500, { error: orderErr?.message || 'Error al registrar la orden.' });
        }

        // 2. Insert items with real order_id
        const orderItems = items.map((it: any) => ({
          order_id: newOrder.id,
          product_id: it.product_id,
          supplier_id: it.supplier_id,
          product_name: it.product_name,
          quantity: it.quantity,
          unit_price_usd: it.unit_price_usd,
          unit_price_btc: it.unit_price_btc,
          total_usd: it.total_usd,
          total_btc: it.total_btc,
        }));

        const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
        if (itemsErr) {
          console.error('Order items error:', itemsErr);
        }

        // 3. Decrement stock server-side
        for (const it of items) {
          if (it.product_id && it.quantity) {
            try {
              const { data: prod } = await supabase.from('products').select('stock').eq('id', it.product_id).maybeSingle();
              if (prod) {
                const remainingStock = Math.max(0, (prod.stock || 0) - it.quantity);
                await supabase.from('products').update({ stock: remainingStock, updated_at: new Date().toISOString() }).eq('id', it.product_id);
              }
            } catch {}
          }
        }

        return sendJson(res, 201, {
          success: true,
          order: newOrder,
        });
      }

      // GET /api/orders/lookup?code=...
      if (subSegment === 'lookup' && method === 'GET') {
        const urlObj = new URL(req.url, 'http://localhost');
        const code = urlObj.searchParams.get('code') || (req.query?.code as string);

        if (!code || !code.trim()) {
          return sendJson(res, 400, { error: 'Código de voucher o número de orden requerido.' });
        }

        const cleanCode = code.trim();
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .or(`voucher_code.eq.${cleanCode},order_number.eq.${cleanCode}`)
          .maybeSingle();

        if (orderErr || !orderData) {
          return sendJson(res, 404, { error: 'No se encontró ningún voucher con ese código.' });
        }

        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderData.id);

        return sendJson(res, 200, {
          success: true,
          order: {
            ...orderData,
            items: itemsData || [],
          },
        });
      }

      return sendJson(res, 404, { error: 'Ruta de órdenes no encontrada.' });
    }

    // ------------------------------------------------------------------------
    // 5. PUBLIC Q&A & REVIEWS (/api/qa, /api/reviews)
    // ------------------------------------------------------------------------
    if (rootSegment === 'qa') {
      const supabase = getServerSupabase();

      // GET /api/qa?productId=...
      if (method === 'GET') {
        const urlObj = new URL(req.url, 'http://localhost');
        const productId = urlObj.searchParams.get('productId') || (req.query?.productId as string);

        if (!productId) {
          return sendJson(res, 400, { error: 'ID de producto requerido.' });
        }

        const { data, error } = await supabase
          .from('product_questions')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) {
          return sendJson(res, 500, { error: error.message });
        }

        return sendJson(res, 200, { success: true, questions: data || [] }, { cache: 'public-edge' });
      }

      // POST /api/qa (Submit question)
      if (method === 'POST') {
        const body = await parseBody(req);
        const { productId, supplierId, productName, userName, userEmail, question } = body;

        if (!productId || !question?.trim()) {
          return sendJson(res, 400, { error: 'Pregunta y producto requeridos.' });
        }

        const insertPayload = {
          product_id: productId,
          supplier_id: supplierId || null,
          product_name: productName,
          user_name: (userName || 'Comprador Web3').trim(),
          user_email: userEmail?.trim() || null,
          question: question.trim(),
          answer: null,
          answered_at: null,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('product_questions')
          .insert([insertPayload])
          .select()
          .single();

        if (error) {
          return sendJson(res, 500, { error: error.message });
        }

        return sendJson(res, 201, { success: true, question: data });
      }
    }

    if (rootSegment === 'reviews') {
      const supabase = getServerSupabase();

      // GET /api/reviews?productId=...
      if (method === 'GET') {
        const urlObj = new URL(req.url, 'http://localhost');
        const productId = urlObj.searchParams.get('productId') || (req.query?.productId as string);

        if (!productId) {
          return sendJson(res, 400, { error: 'ID de producto requerido.' });
        }

        const { data, error } = await supabase
          .from('product_reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) {
          return sendJson(res, 500, { error: error.message });
        }

        return sendJson(res, 200, { success: true, reviews: data || [] }, { cache: 'public-edge' });
      }

      // POST /api/reviews (Submit review + recalculate average)
      if (method === 'POST') {
        const body = await parseBody(req);
        const { productId, supplierId, userName, userEmail, userWallet, rating, comment, voucherCode, verifiedPurchase } = body;

        if (!productId || !comment?.trim() || !rating) {
          return sendJson(res, 400, { error: 'Calificación y comentario son requeridos.' });
        }

        const insertPayload = {
          product_id: productId,
          supplier_id: supplierId || null,
          user_name: (userName || 'Comprador Bitcoin').trim(),
          user_email: userEmail?.trim() || null,
          user_wallet: userWallet?.trim() || null,
          rating: Math.max(1, Math.min(5, Math.round(Number(rating)))),
          comment: comment.trim(),
          voucher_code: voucherCode?.trim() || null,
          verified_purchase: Boolean(verifiedPurchase || voucherCode),
          created_at: new Date().toISOString(),
        };

        const { data: reviewData, error: revErr } = await supabase
          .from('product_reviews')
          .insert([insertPayload])
          .select()
          .single();

        if (revErr) {
          return sendJson(res, 500, { error: revErr.message });
        }

        // Recalculate rating on server
        try {
          const { data: allReviews } = await supabase
            .from('product_reviews')
            .select('rating')
            .eq('product_id', productId);

          if (allReviews && allReviews.length > 0) {
            const avg = allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length;
            await supabase
              .from('products')
              .update({
                rating: parseFloat(avg.toFixed(1)),
                reviews_count: allReviews.length,
                updated_at: new Date().toISOString(),
              })
              .eq('id', productId);
          }
        } catch (calcErr) {
          console.error('Error recalculating rating:', calcErr);
        }

        return sendJson(res, 201, { success: true, review: reviewData });
      }
    }

    // ------------------------------------------------------------------------
    // 6. PROTECTED SUPPLIER PORTAL ENDPOINTS (/api/supplier/*)
    // ------------------------------------------------------------------------
    if (rootSegment === 'supplier') {
      const { supplier: authPayload, renewedCookie } = authenticateRequest(req);
      if (!authPayload) {
        return sendJson(res, 401, { error: 'No autorizado. Se requiere inicio de sesión con token JWT válido.' });
      }

      const supplierId = authPayload.sub;
      const supabase = getServerSupabase();

      // --- Consolidado de Portal (Single Request) ---
      if (subSegment === 'data' && method === 'GET') {
        const { data, error: queryError } = await supabase
          .from('suppliers')
          .select('id, company_name, email, products(*), order_items(*, orders(*)), product_reviews(*), product_questions(*)')
          .eq('id', supplierId)
          .single();

        if (queryError) return sendJson(res, 500, { error: queryError.message });
        return sendJson(res, 200, { success: true, data }, { cookie: renewedCookie });
      }

      // --- Perfil Base del Proveedor ---
      if (subSegment === 'profile' && method === 'PUT') {
        const body = await parseBody(req);
        const { company_name, contact_name, phone, avatar_url, wallet_address } = body;

        const updateData: any = { updated_at: new Date().toISOString() };
        if (company_name !== undefined) updateData.company_name = company_name;
        if (contact_name !== undefined) updateData.contact_name = contact_name;
        if (phone !== undefined) updateData.phone = phone;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
        if (wallet_address !== undefined) updateData.wallet_address = wallet_address;

        const { data: updatedUser, error: updateErr } = await supabase
          .from('suppliers')
          .update(updateData)
          .eq('id', supplierId)
          .select('id, email, company_name, phone, wallet_address, avatar_url, blobatar_identifier, created_at')
          .single();

        if (updateErr) return sendJson(res, 500, { error: updateErr.message });
        return sendJson(res, 200, { success: true, supplier: updatedUser }, { cookie: renewedCookie });
      }

      // --- Mis Productos ---
      if (subSegment === 'products') {
        // GET /api/supplier/products
        if (method === 'GET') {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('supplier_id', supplierId)
            .order('created_at', { ascending: false });

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, products: data || [] }, { cookie: renewedCookie });
        }

        // POST /api/supplier/products
        if (method === 'POST') {
          const body = await parseBody(req);
          const payload = {
            ...body,
            supplier_id: supplierId, // Strictly enforced by verified token
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('products')
            .insert([payload])
            .select()
            .single();

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 201, { success: true, product: data }, { cookie: renewedCookie });
        }

        // PUT /api/supplier/products/:id
        if (method === 'PUT' && thirdSegment) {
          const body = await parseBody(req);
          const { id: _, supplier_id: __, ...updateFields } = body;

          const { data, error } = await supabase
            .from('products')
            .update({
              ...updateFields,
              updated_at: new Date().toISOString(),
            })
            .eq('id', thirdSegment)
            .eq('supplier_id', supplierId)
            .select()
            .single();

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, product: data }, { cookie: renewedCookie });
        }

        // PATCH /api/supplier/products/:id/stock
        if (method === 'PATCH' && thirdSegment && pathSegments[3] === 'stock') {
          const body = await parseBody(req);
          const { stock } = body;

          const { data, error } = await supabase
            .from('products')
            .update({
              stock: Number(stock),
              updated_at: new Date().toISOString(),
            })
            .eq('id', thirdSegment)
            .eq('supplier_id', supplierId)
            .select()
            .single();

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, product: data }, { cookie: renewedCookie });
        }

        // DELETE /api/supplier/products/:id
        if (method === 'DELETE' && thirdSegment) {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', thirdSegment)
            .eq('supplier_id', supplierId);

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, message: 'Producto eliminado.' }, { cookie: renewedCookie });
        }
      }

      // --- Órdenes del Proveedor ---
      if (subSegment === 'orders' && method === 'GET') {
        const { data, error } = await supabase
          .from('order_items')
          .select('*, orders(*)')
          .eq('supplier_id', supplierId)
          .order('created_at', { ascending: false });

        if (error) return sendJson(res, 500, { error: error.message });
        return sendJson(res, 200, { success: true, orderItems: data || [] }, { cookie: renewedCookie });
      }

      // --- Preguntas del Proveedor ---
      if (subSegment === 'questions') {
        if (method === 'GET') {
          const { data, error } = await supabase
            .from('product_questions')
            .select('*')
            .eq('supplier_id', supplierId)
            .order('created_at', { ascending: false });

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, questions: data || [] }, { cookie: renewedCookie });
        }

        // POST /api/supplier/questions/:id/answer
        if (method === 'POST' && thirdSegment && pathSegments[3] === 'answer') {
          const body = await parseBody(req);
          const { answer } = body;

          const { error } = await supabase
            .from('product_questions')
            .update({
              answer: (answer || '').trim(),
              answered_at: new Date().toISOString(),
            })
            .eq('id', thirdSegment)
            .eq('supplier_id', supplierId);

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true }, { cookie: renewedCookie });
        }
      }

      // --- Reseñas del Proveedor ---
      if (subSegment === 'reviews' && method === 'GET') {
        const { data: prods } = await supabase
          .from('products')
          .select('id, name')
          .eq('supplier_id', supplierId);

        const productIds = (prods || []).map((p) => p.id);
        const prodNameMap: Record<string, string> = {};
        (prods || []).forEach((p) => {
          prodNameMap[p.id] = p.name;
        });

        let query = supabase.from('product_reviews').select('*');
        if (productIds.length > 0) {
          query = query.or(`supplier_id.eq.${supplierId},product_id.in.(${productIds.join(',')})`);
        } else {
          query = query.eq('supplier_id', supplierId);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) return sendJson(res, 500, { error: error.message });

        const mapped = (data || []).map((r) => ({
          ...r,
          product_name: prodNameMap[r.product_id] || 'Producto del Catálogo',
        }));

        return sendJson(res, 200, { success: true, reviews: mapped }, { cookie: renewedCookie });
      }

      // --- KYC Fiscal ---
      if (subSegment === 'kyc') {
        if (method === 'GET') {
          const { data } = await supabase
            .from('supplier_kyc_fiscal')
            .select('*')
            .eq('supplier_id', supplierId)
            .maybeSingle();

          return sendJson(res, 200, { success: true, kyc: data || null }, { cookie: renewedCookie });
        }

        if (method === 'POST') {
          const body = await parseBody(req);
          const payload = {
            ...body,
            supplier_id: supplierId,
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('supplier_kyc_fiscal')
            .upsert(payload, { onConflict: 'supplier_id' })
            .select()
            .single();

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, kyc: data }, { cookie: renewedCookie });
        }
      }

      // --- Commercial Profile ---
      if (subSegment === 'commercial-profile') {
        if (method === 'GET') {
          const { data } = await supabase
            .from('supplier_commercial_profiles')
            .select('*')
            .eq('supplier_id', supplierId)
            .maybeSingle();

          return sendJson(res, 200, { success: true, profile: data || null }, { cookie: renewedCookie });
        }

        if (method === 'POST') {
          const body = await parseBody(req);
          const payload = {
            ...body,
            supplier_id: supplierId,
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('supplier_commercial_profiles')
            .upsert(payload, { onConflict: 'supplier_id' })
            .select()
            .single();

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, profile: data }, { cookie: renewedCookie });
        }
      }

      // --- Wallets ---
      if (subSegment === 'wallets') {
        if (method === 'GET') {
          const { data } = await supabase
            .from('supplier_wallets')
            .select('*')
            .eq('supplier_id', supplierId)
            .order('created_at', { ascending: true });

          return sendJson(res, 200, { success: true, wallets: data || [] }, { cookie: renewedCookie });
        }

        if (method === 'POST') {
          const body = await parseBody(req);
          const wallets = Array.isArray(body) ? body : body.wallets || [];

          await supabase.from('supplier_wallets').delete().eq('supplier_id', supplierId);

          if (wallets.length > 0) {
            const records = wallets.map((w: any) => ({
              supplier_id: supplierId,
              wallet_address: w.wallet_address.trim(),
              network: w.network || 'EVM',
              label: w.label || 'Billetera',
              is_primary: Boolean(w.is_primary),
            }));

            await supabase.from('supplier_wallets').insert(records);
          }

          return sendJson(res, 200, { success: true }, { cookie: renewedCookie });
        }
      }

      // --- Voucher Config ---
      if (subSegment === 'voucher-config') {
        if (method === 'GET') {
          const { data } = await supabase
            .from('supplier_voucher_configs')
            .select('*')
            .eq('supplier_id', supplierId)
            .maybeSingle();

          return sendJson(res, 200, { success: true, config: data || null }, { cookie: renewedCookie });
        }

        if (method === 'POST') {
          const body = await parseBody(req);
          const payload = {
            supplier_id: supplierId,
            allow_80mm: body.allow_80mm ?? true,
            allow_digital: body.allow_digital ?? true,
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('supplier_voucher_configs')
            .upsert(payload, { onConflict: 'supplier_id' })
            .select()
            .single();

          if (error) return sendJson(res, 500, { error: error.message });
          return sendJson(res, 200, { success: true, config: data }, { cookie: renewedCookie });
        }
      }

      // --- Storage: Upload & Delete on Server ---
      if (subSegment === 'storage') {
        const bucket = getStorageBucketName();

        if (thirdSegment === 'upload' && method === 'POST') {
          const body = await parseBody(req);
          const { base64Data, fileName, contentType } = body;

          if (!base64Data || !fileName) {
            return sendJson(res, 400, { error: 'Datos de imagen requeridos.' });
          }

          const buffer = Buffer.from(base64Data, 'base64');
          const cleanName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 30);
          const filePath = `products/${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${cleanName}`;

          const { data: uploadData, error: upErr } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
              contentType: contentType || 'image/webp',
              cacheControl: '31536000',
              upsert: true,
            });

          if (upErr || !uploadData) {
            return sendJson(res, 500, { error: upErr?.message || 'Error al almacenar imagen.' });
          }

          const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(uploadData.path);

          return sendJson(res, 201, {
            success: true,
            url: publicUrlData.publicUrl,
          }, { cookie: renewedCookie });
        }

        if (thirdSegment === 'delete' && method === 'POST') {
          const body = await parseBody(req);
          const { imageUrl } = body;

          if (!imageUrl) {
            return sendJson(res, 400, { error: 'URL de imagen requerida.' });
          }

          const prefix = `/storage/v1/object/public/${bucket}/`;
          const index = imageUrl.indexOf(prefix);
          if (index !== -1) {
            const filePath = imageUrl.substring(index + prefix.length);
            await supabase.storage.from(bucket).remove([filePath]);
          }

          return sendJson(res, 200, { success: true }, { cookie: renewedCookie });
        }
      }

      // --- Notifications Read ---
      if (subSegment === 'notifications') {
        if (method === 'GET') {
          const { data } = await supabase
            .from('supplier_notifications_read')
            .select('notification_id')
            .eq('supplier_id', supplierId);

          const ids = (data || []).map((r) => r.notification_id);
          return sendJson(res, 200, { success: true, readIds: ids }, { cookie: renewedCookie });
        }

        if (method === 'POST') {
          const body = await parseBody(req);
          const ids = Array.isArray(body) ? body : body.ids || [];

          if (ids.length > 0) {
            const records = ids.map((id: string) => ({
              supplier_id: supplierId,
              notification_id: id,
            }));
            await supabase.from('supplier_notifications_read').upsert(records);
          }

          return sendJson(res, 200, { success: true }, { cookie: renewedCookie });
        }
      }

      // --- Delete Account ---
      if (subSegment === 'account' && method === 'DELETE') {
        // Cascade delete all supplier records
        await Promise.all([
          supabase.from('products').delete().eq('supplier_id', supplierId),
          supabase.from('supplier_wallets').delete().eq('supplier_id', supplierId),
          supabase.from('supplier_kyc_fiscal').delete().eq('supplier_id', supplierId),
          supabase.from('supplier_commercial_profiles').delete().eq('supplier_id', supplierId),
          supabase.from('supplier_voucher_configs').delete().eq('supplier_id', supplierId),
          supabase.from('supplier_notifications_read').delete().eq('supplier_id', supplierId),
          supabase.from('product_questions').delete().eq('supplier_id', supplierId),
        ]);

        await supabase.from('suppliers').delete().eq('id', supplierId);

        return sendJson(
          res,
          200,
          { success: true, message: 'Cuenta y datos eliminados permanentemente.' },
          { cookie: createClearAuthCookie() }
        );
      }

      return sendJson(res, 404, { error: 'Recurso de proveedor no encontrado.' });
    }

    return sendJson(res, 404, { error: 'Endpoint no encontrado.' });
  } catch (fatalErr: any) {
    console.error('API Error:', fatalErr);
    return sendJson(res, 500, {
      error: 'Error interno del servidor en el backend de NovaSats.',
      message: fatalErr.message,
    });
  }
}

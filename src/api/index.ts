import { handleApi } from './router';

export default async function handler(req: any, res: any) {
  return handleApi(req, res);
}

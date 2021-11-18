import  {Algorithm} from 'jsonwebtoken';

export const algorithm: Algorithm = 'HS256';
export const secretKey = 'merrccury';
export const expiresInAccess = 3600;
export const expiresInRefresh = 86400;
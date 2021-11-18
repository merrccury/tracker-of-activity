import jwt, { Algorithm, JwtPayload } from 'jsonwebtoken';
import {algorithm, secretKey, expiresInRefresh, expiresInAccess} from '../config/jwt-config'

class Jwt {
    private secretKey = secretKey;

    private expiresInAccess = expiresInAccess;

    private expiresInRefresh = expiresInRefresh;

    private algorithm: Algorithm = algorithm;

    private accessToken: string | null = null;

    private refreshToken: string | null = null;

    public getSecretKey(): string {
        return this.secretKey;
    }

    public createAccessToken(payload: {
        id: string;
    }): string {
        this.accessToken = jwt.sign(payload, this.secretKey, {
            algorithm: this.algorithm,
            expiresIn: this.expiresInAccess,
        });
        return this.accessToken;
    }

    public createRefreshToken(payload: {
        id: string;
    }): string {
        this.refreshToken = jwt.sign(payload, this.secretKey, {
            algorithm: this.algorithm,
            expiresIn: this.expiresInRefresh,
        });
        return this.refreshToken;
    }

    public parseToken(token: string): Promise<JwtPayload > {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secretKey, (verifyError, payload) => {
                if (verifyError === null) return resolve(payload || {});
                return reject(verifyError);
            });
        });
    }
}

export default Jwt;

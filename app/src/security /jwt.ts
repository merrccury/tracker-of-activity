import jwt, { Algorithm, JwtPayload } from 'jsonwebtoken';

class Jwt {
    private secretKey = 'merrccury';

    private expiresInAccess = 3600;

    private expiresInRefresh = 86400;

    private algorithm: Algorithm = 'HS256';

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
        // console.log('this.refreshToken', this.refreshToken);
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

import jwt_decode from 'jwt-decode';

export class JWT {
    static decode = <T>(token: string) => jwt_decode<T>(token);
}
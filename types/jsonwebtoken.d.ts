declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
    [key: string]: any;
  }

  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: string | Buffer,
    options?: object
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: object
  ): JwtPayload;

  export function decode(token: string, options?: object): JwtPayload | null;
}

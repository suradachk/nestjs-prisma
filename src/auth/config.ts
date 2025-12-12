export interface JwtConfig {
  secret: string;
  expires: string;
  refreshExpires: string;
}

export const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET || 'secretkey',
  expires: process.env.AUTH_EXPIRES || '1d',
  refreshExpires: process.env.AUTH_REFRESH_EXPIRES || '5min',
};

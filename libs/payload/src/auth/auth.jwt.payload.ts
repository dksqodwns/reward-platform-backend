export interface AuthAccessTokenPayload {
  userId: string;
  email: string;
  roles: string[];
}

export interface AuthRefreshTokenPayload {
  userId: string;
}

export interface ReturnAccessTokenPayload {
  accessToken: string;
  expiresAt: Date;
}

export interface ReturnRefreshTokenPayload {
  refreshToken: string;
  expiresAt: Date;
}

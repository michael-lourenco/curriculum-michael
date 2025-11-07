/**
 * Copyright 2024
 *
 * Authentication
 *
 * Perform authentication.
 *     - Endpoints:
 *          - Authorization
 *              - Docs: https://developers.tiktok.com/doc/login-kit-web/
 *          - /oauth/token/ (user access) POST
 *              - Docs: https://developers.tiktok.com/doc/oauth-user-access-token-management/
 *          - /oauth/revoke/ POST
 *              - Docs: https://developers.tiktok.com/doc/oauth-user-access-token-management/
 *          - /oauth/token/ (client access) POST
 *              - Docs: https://developers.tiktok.com/doc/client-access-token-management/
 */

import { TikTok } from '../TikTok';
import { BASE_AUTHORIZATION_URL } from '../request/constants';
import { Params, Utils, CODE_CHALLENGE_METHOD } from '../request/constants';
import { TikTokConfig, ApiResponse } from '../request/types';

export class Authentication extends TikTok {
  protected clientKey!: string;
  protected clientSecret!: string;

  // Grant types
  static readonly GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
  static readonly GRANT_TYPE_CLIENT_CREDENTIALS = 'client_credentials';
  static readonly GRANT_TYPE_REFRESH_TOKEN = 'refresh_token';

  // Response type
  static readonly RESPONSE_TYPE_CODE = 'code';

  /**
   * Constructor for instantiating a new TikTok authentication object
   */
  constructor(config: TikTokConfig & { client_key: string; client_secret: string }) {
    super(config);
    this.setClientKey(config.client_key);
    this.setClientSecret(config.client_secret);
  }

  /**
   * Return the client key
   */
  getClientKey(): string {
    return this.clientKey;
  }

  /**
   * Return the client secret
   */
  getClientSecret(): string {
    return this.clientSecret;
  }

  /**
   * Set the client key
   */
  setClientKey(clientKey: string): void {
    this.clientKey = clientKey;
  }

  /**
   * Set the client secret
   */
  setClientSecret(clientSecret: string): void {
    this.clientSecret = clientSecret;
  }

  /**
   * Get an access token from the authorization code
   * 
   * @param authorizationCode - The authorization code received from TikTok
   * @param redirectUri - The redirect URI used in the authorization request
   * @param codeVerifier - The code verifier used for PKCE (required by TikTok)
   */
  async getAccessTokenFromCode(
    authorizationCode: string,
    redirectUri: string,
    codeVerifier: string
  ): Promise<ApiResponse> {
    return this.post({
      endpoint: '/oauth/token/',
      params: {
        [Params.CLIENT_KEY]: this.getClientKey(),
        [Params.CLIENT_SECRET]: this.getClientSecret(),
        [Params.CODE]: authorizationCode,
        [Params.GRANT_TYPE]: Authentication.GRANT_TYPE_AUTHORIZATION_CODE,
        [Params.REDIRECT_URI]: redirectUri,
        [Params.CODE_VERIFIER]: codeVerifier,
      },
    });
  }

  /**
   * Get the url for a user to prompt them with the authorization dialog
   * 
   * @param redirectUri - The redirect URI after authorization
   * @param scope - The scopes to request (comma-separated string or array)
   * @param state - Optional state parameter for security
   * @param codeChallenge - The code challenge for PKCE (required by TikTok)
   */
  getAuthenticationUrl(
    redirectUri: string,
    scope: string | string[],
    state: string = '',
    codeChallenge: string
  ): string {
    const scopeArray = Array.isArray(scope) ? scope : scope.split(',');
    const params: Record<string, string> = {
      [Params.CLIENT_KEY]: this.getClientKey(),
      [Params.RESPONSE_TYPE]: Authentication.RESPONSE_TYPE_CODE,
      [Params.REDIRECT_URI]: redirectUri,
      [Params.SCOPE]: Utils.commaStringToArray(scopeArray),
      [Params.STATE]: state,
      [Params.CODE_CHALLENGE]: codeChallenge,
      [Params.CODE_CHALLENGE_METHOD]: CODE_CHALLENGE_METHOD,
    };

    const queryString = new URLSearchParams(params).toString();
    return `${BASE_AUTHORIZATION_URL}/${this.graphVersion}/auth/authorize/?${queryString}`;
  }

  /**
   * Get a client access token
   */
  async getClientAccessToken(): Promise<ApiResponse> {
    return this.post({
      endpoint: '/oauth/token/',
      params: {
        [Params.CLIENT_KEY]: this.getClientKey(),
        [Params.CLIENT_SECRET]: this.getClientSecret(),
        [Params.GRANT_TYPE]: Authentication.GRANT_TYPE_CLIENT_CREDENTIALS,
      },
    });
  }

  /**
   * Refresh an access token
   */
  async getRefreshAccessToken(accessToken: string): Promise<ApiResponse> {
    return this.post({
      endpoint: '/oauth/token/',
      params: {
        [Params.CLIENT_KEY]: this.getClientKey(),
        [Params.CLIENT_SECRET]: this.getClientSecret(),
        [Params.GRANT_TYPE]: Authentication.GRANT_TYPE_REFRESH_TOKEN,
        [Params.REFRESH_TOKEN]: accessToken,
      },
    });
  }

  /**
   * Revoke access
   */
  async revokeAccessToken(accessToken: string): Promise<ApiResponse> {
    return this.post({
      endpoint: '/oauth/revoke/',
      params: {
        [Params.CLIENT_KEY]: this.getClientKey(),
        [Params.CLIENT_SECRET]: this.getClientSecret(),
        [Params.TOKEN]: accessToken,
      },
    });
  }
}


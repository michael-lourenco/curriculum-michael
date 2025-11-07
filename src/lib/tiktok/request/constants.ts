/**
 * Copyright 2024
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { randomBytes, createHash } from 'crypto';

/**
 * HTTP Methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * Base URLs
 */
export const BASE_GRAPH_URL = 'https://open.tiktokapis.com';
export const BASE_AUTHORIZATION_URL = 'https://www.tiktok.com';

/**
 * Default Graph API version
 */
export const DEFAULT_GRAPH_VERSION = 'v2';

/**
 * Query parameters constants
 */
export const Params = {
  CLIENT_KEY: 'client_key',
  CLIENT_SECRET: 'client_secret',
  CODE: 'code',
  CODE_CHALLENGE: 'code_challenge',
  CODE_CHALLENGE_METHOD: 'code_challenge_method',
  CODE_VERIFIER: 'code_verifier',
  GRANT_TYPE: 'grant_type',
  FIELDS: 'fields',
  FILTERS: 'filters',
  REDIRECT_URI: 'redirect_uri',
  RESPONSE_TYPE: 'response_type',
  SCOPE: 'scope',
  STATE: 'state',
  REFRESH_TOKEN: 'refresh_token',
  VIDEO_IDS: 'video_ids',
  TOKEN: 'token',
} as const;

/**
 * Fields constants
 */
export const Fields = {
  AUTO_ADD_MUSIC: 'auto_add_music',
  AVATAR_LARGE_URL: 'avatar_large_url',
  AVATAR_URL: 'avatar_url',
  AVATAR_URL_100: 'avatar_url_100',
  BIO_DESCRIPTION: 'bio_description',
  BRAND_CONTENT_TOGGLE: 'brand_content_toggle',
  BRAND_ORGANIC_TOGGLE: 'brand_organic_toggle',
  CHUNK_SIZE: 'chunk_size',
  COMMENT_COUNT: 'comment_count',
  COVER_IMAGE_URL: 'cover_image_url',
  CREATE_TIME: 'create_time',
  DESCRIPTION: 'description',
  DISABLE_COMMENT: 'disable_comment',
  DISABLE_DUET: 'disable_duet',
  DISABLE_STITCH: 'disable_stitch',
  DISPLAY_NAME: 'display_name',
  DURATION: 'duration',
  EMBED_HTML: 'embed_html',
  EMBED_LINK: 'embed_link',
  FOLLOWER_COUNT: 'follower_count',
  FOLLOWING_COUNT: 'following_count',
  HEIGHT: 'height',
  ID: 'id',
  IS_AIGC: 'is_aigc',
  IS_VERIFIED: 'is_verified',
  LIKE_COUNT: 'like_count',
  LIKES_COUNT: 'likes_count',
  MEDIA_TYPE: 'media_type',
  OPEN_ID: 'open_id',
  PHOTO_COVER_INDEX: 'photo_cover_index',
  PHOTO_IMAGES: 'photo_images',
  POST_INFO: 'post_info',
  POST_MODE: 'post_mode',
  PRIVACY_LEVEL: 'privacy_level',
  PROFILE_DEEP_LINK: 'profile_deep_link',
  PUBLISH_ID: 'publish_id',
  SHARE_COUNT: 'share_count',
  SHARE_URL: 'share_url',
  SOURCE: 'source',
  SOURCE_INFO: 'source_info',
  TITLE: 'title',
  TOTAL_CHUNK_COUNT: 'total_chunk_count',
  UNION_ID: 'union_id',
  VIDEO_COUNT: 'video_count',
  VIDEO_COVER_TIMESTAMP_MS: 'video_cover_timestamp_ms',
  VIDEO_DESCRIPTION: 'video_description',
  VIDEO_URL: 'video_url',
  VIDEO_SIZE: 'video_size',
  VIEW_COUNT: 'view_count',
  WIDTH: 'width',
} as const;

/**
 * PKCE challenge method
 */
export const CODE_CHALLENGE_METHOD = 'S256';

/**
 * Utility functions
 */
export const Utils = {
  /**
   * Convert array to comma separated string
   */
  commaStringToArray: (array: string[] = []): string => {
    return array.join(',');
  },

  /**
   * Get fields param object
   */
  getFieldsParam: (fields: string[]): Record<string, string> => {
    return {
      [Params.FIELDS]: Utils.commaStringToArray(fields),
    };
  },
};

/**
 * PKCE (Proof Key for Code Exchange) utility functions
 * Required by TikTok OAuth for security
 */
export const PKCE = {
  /**
   * Generate a random code verifier for PKCE
   * Returns a cryptographically random string of 43-128 characters
   * using URL-safe characters (A-Z, a-z, 0-9, -, ., _, ~)
   */
  generateCodeVerifier(): string {
    // Generate 96 random bytes (produces ~128 base64 characters, within 43-128 range)
    const randomBytesBuffer = randomBytes(96);
    
    // Convert to base64url
    const base64 = randomBytesBuffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Ensure it's within the required length (43-128 characters)
    return base64.substring(0, 128);
  },

  /**
   * Generate code challenge from code verifier using SHA256
   * TikTok requires hexadecimal encoding (not base64url)
   * 
   * @param codeVerifier - The code verifier string
   * @returns Promise<string> - The code challenge as hexadecimal string
   */
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // Use Node.js crypto for hashing (always available in Next.js server-side)
    const hash = createHash('sha256').update(codeVerifier).digest('hex');
    return hash;
  },

  /**
   * Generate both code verifier and code challenge
   * @returns Promise<{codeVerifier: string, codeChallenge: string}>
   */
  async generatePair(): Promise<{ codeVerifier: string; codeChallenge: string }> {
    const codeVerifier = PKCE.generateCodeVerifier();
    const codeChallenge = await PKCE.generateCodeChallenge(codeVerifier);
    return { codeVerifier, codeChallenge };
  },
};


/**
 * Copyright 2024
 *
 * User
 *
 * Get the Users info.
 *     - Endpoints:
 *          - /user/info/ GET
 *              - Docs: https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/
 */

import { TikTok } from '../TikTok';
import { TikTokConfig, ApiResponse } from '../request/types';

export class User extends TikTok {
  static readonly ENDPOINT = 'user';

  /**
   * Constructor for instantiating a new object
   */
  constructor(config: TikTokConfig) {
    super(config);
  }

  /**
   * Get the users info
   */
  async getSelf(params: Record<string, any> = {}): Promise<ApiResponse> {
    return this.get({
      endpoint: `/${User.ENDPOINT}/info/`,
      params,
    });
  }
}


/**
 * Copyright 2024
 *
 * Webhooks
 *
 * Perform webhooks duties.
 *     - Docs: https://developers.tiktok.com/doc/webhooks-overview?enter_method=left_navigation
 */

import { NextRequest } from 'next/server';

export class Webhooks {
  /**
   * Get raw JSON payload from TikTok
   */
  async getRawPayload(req: NextRequest | { body?: any }): Promise<string> {
    if (req instanceof NextRequest) {
      // For Next.js API routes, read the body as text
      return await req.text();
    }
    // For other cases
    return JSON.stringify(req.body || {});
  }

  /**
   * Get JSON payload from TikTok in a nice object
   */
  async getJsonPayloadData(req: NextRequest | { body?: any }): Promise<any> {
    if (req instanceof NextRequest) {
      return await req.json();
    }
    return req.body || {};
  }
}


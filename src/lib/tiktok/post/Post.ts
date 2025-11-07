/**
 * Copyright 2024
 *
 * Post
 *
 * Content posting.
 *     - Endpoints:
 *          - /post/publish/video/init/ POST
 *              - Docs: https://developers.tiktok.com/doc/content-posting-api-reference-direct-post/
 *          - /post/publish/inbox/video/init/ POST
 *              - Docs: https://developers.tiktok.com/doc/content-posting-api-reference-upload-video/
 */

import { TikTok } from '../TikTok';
import { HttpMethod } from '../request/constants';
import { TikTokConfig, ApiResponse } from '../request/types';

export class Post extends TikTok {
  static readonly ENDPOINT = 'post/publish';

  /**
   * Constructor for instantiating a new object
   */
  constructor(config: TikTokConfig) {
    super(config);
  }

  /**
   * Create draft video
   */
  async draft(params: Record<string, any> = {}): Promise<ApiResponse> {
    return this.post({
      endpoint: `/${Post.ENDPOINT}/inbox/video/init/`,
      params,
    });
  }

  /**
   * Post photos
   */
  async photos(params: Record<string, any> = {}): Promise<ApiResponse> {
    return this.post({
      endpoint: `/${Post.ENDPOINT}/content/init/`,
      params,
    });
  }

  /**
   * Publish video
   */
  async publish(params: Record<string, any> = {}): Promise<ApiResponse> {
    return this.post({
      endpoint: `/${Post.ENDPOINT}/video/init/`,
      params,
    });
  }

  /**
   * Get creator info
   */
  async queryCreatorInfo(params: Record<string, any> = {}): Promise<ApiResponse> {
    return this.post({
      endpoint: `/${Post.ENDPOINT}/creator_info/query/`,
      params,
    });
  }

  /**
   * Fetch status
   */
  async fetchStatus(params: Record<string, any> = {}): Promise<ApiResponse> {
    return this.post({
      endpoint: `/${Post.ENDPOINT}/status/fetch/`,
      params,
    });
  }

  /**
   * Upload file to TikTok Server
   */
  async uploadFile(
    uploadUrl: string,
    file: { path: string; mime_type: string }
  ): Promise<ApiResponse> {
    // Get file size
    const fs = await import('fs');
    const fileSize = fs.statSync(file.path).size;

    const headers: Record<string, string> = {
      'Content-Range': `bytes 0-${fileSize - 1}/${fileSize}`,
      'Content-Length': String(fileSize),
      'Content-Type': file.mime_type,
    };

    // Make request to the api
    const response = await this.sendCustomRequest(
      uploadUrl,
      HttpMethod.PUT,
      headers,
      file
    );

    return response;
  }
}


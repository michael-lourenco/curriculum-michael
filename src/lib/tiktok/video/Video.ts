/**
 * Copyright 2024
 *
 * Video
 *
 * Get videos.
 *     - Endpoints:
 *          - /video/list/ POST
 *              - Docs: https://developers.tiktok.com/doc/tiktok-api-v2-video-list/
 *          - /video/query/ POST
 *              - Docs: https://developers.tiktok.com/doc/tiktok-api-v2-video-query
 */

import { TikTok } from '../TikTok';
import { Params, Fields } from '../request/constants';
import { TikTokConfig, ApiResponse } from '../request/types';

export class Video extends TikTok {
  static readonly ENDPOINT = 'video';

  protected fields: string[] = [
    Fields.ID,
    Fields.CREATE_TIME,
    Fields.TITLE,
    Fields.COVER_IMAGE_URL,
    Fields.SHARE_URL,
    Fields.VIDEO_DESCRIPTION,
    Fields.DURATION,
    Fields.HEIGHT,
    Fields.WIDTH,
    Fields.EMBED_HTML,
    Fields.EMBED_LINK,
    Fields.LIKE_COUNT,
    Fields.COMMENT_COUNT,
    Fields.SHARE_COUNT,
    Fields.VIEW_COUNT,
  ];

  /**
   * Constructor for instantiating a new object
   */
  constructor(config: TikTokConfig) {
    super(config);
  }

  /**
   * Get videos list
   */
  async getList(
    params: Record<string, any> = {},
    fields: string[] = []
  ): Promise<ApiResponse> {
    const fieldsToUse = fields.length > 0 ? fields : this.fields;
    const endpoint = `/${Video.ENDPOINT}/list/?${Params.FIELDS}=${fieldsToUse.join(',')}`;

    return this.post({
      endpoint,
      params,
    });
  }

  /**
   * Check videos by ids
   */
  async query(
    videoIds: string[],
    fields: string[] = []
  ): Promise<ApiResponse> {
    const fieldsToUse = fields.length > 0 ? fields : this.fields;
    const endpoint = `/${Video.ENDPOINT}/query/?${Params.FIELDS}=${fieldsToUse.join(',')}`;

    return this.post({
      endpoint,
      params: {
        [Params.FILTERS]: JSON.stringify({
          [Params.VIDEO_IDS]: videoIds,
        }),
      },
    });
  }
}


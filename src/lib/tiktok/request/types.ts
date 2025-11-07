/**
 * Types for TikTok API SDK
 */

export interface TikTokConfig {
  access_token?: string;
  graph_version?: string;
  client_key?: string;
  client_secret?: string;
}

export interface RequestParams {
  endpoint: string;
  params?: Record<string, any>;
}

export interface ApiResponse {
  data?: any;
  error?: {
    code: string;
    message: string;
    log_id?: string;
  };
  cursor?: string;
  cursor_next?: string;
  has_more?: boolean;
  debug?: any;
}

export interface FileUpload {
  path: string;
  mime_type: string;
}

export interface RequestOptions {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}


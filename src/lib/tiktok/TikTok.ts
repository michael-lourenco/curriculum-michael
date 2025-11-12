/**
 * Copyright 2024
 *
 * TikTok
 *
 * Core functionality for talking to the TikTok API.
 * Developer Docs: https://developers.tiktok.com/doc/overview/
 */

import { TikTokRequest } from './request/Request';
import { HttpClient } from './request/HttpClient';
import { HttpMethod, DEFAULT_GRAPH_VERSION } from './request/constants';
import { TikTokConfig, RequestParams, ApiResponse } from './request/types';

export class TikTok {
  protected graphVersion: string;
  protected client: HttpClient;
  protected accessToken: string;
  protected request: TikTokRequest | null = null;
  public cursorNext: string = '';

  /**
   * Constructor for instantiating a new TikTok object
   */
  constructor(config: TikTokConfig) {
    this.accessToken = config.access_token || '';
    this.client = new HttpClient();
    this.graphVersion = config.graph_version || DEFAULT_GRAPH_VERSION;
  }

  /**
   * Sends a GET request returns the result
   */
  async get(params: RequestParams): Promise<ApiResponse> {
    const endpointParams = params.params || {};
    return this.sendRequest(HttpMethod.GET, params.endpoint, endpointParams);
  }

  /**
   * Sends a POST request and returns the result
   */
  async post(params: RequestParams): Promise<ApiResponse> {
    const endpointParams = params.params || {};
    return this.sendRequest(HttpMethod.POST, params.endpoint, endpointParams);
  }

  /**
   * Send a custom GET request to the API and returns the result
   */
  async sendCustomRequest(
    customUrl: string,
    requestType: string = HttpMethod.GET,
    headers: Record<string, string> = {},
    file?: { path: string; mime_type: string }
  ): Promise<ApiResponse> {
    this.request = new TikTokRequest(requestType);
    this.request.setUrl(this.graphVersion, customUrl);
    this.request.setHeaders(headers);

    if (file) {
      this.request.setFile(file);
    }

    const response = await this.client.send(this.request);
    
    // Garantir que response não seja null/undefined antes de adicionar debug
    if (response) {
      response.debug = this;
    }

    return response;
  }

  /**
   * Send a request to the API and returns the result
   */
  async sendRequest(
    method: string,
    endpoint: string,
    params: Record<string, any>
  ): Promise<ApiResponse> {
    this.request = new TikTokRequest(
      method,
      endpoint,
      params,
      this.graphVersion,
      this.accessToken
    );

    const response = await this.client.send(this.request);
    
    // Garantir que response não seja null/undefined
    if (response) {
      this.setCursors(response);
      response.debug = this;
    }

    return response;
  }

  /**
   * Set the access token
   */
  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  /**
   * Set cursor
   */
  setCursors(response: ApiResponse): void {
    if (response.data?.has_more) {
      this.cursorNext = response.cursor_next = response.data.cursor;
    }
  }
}


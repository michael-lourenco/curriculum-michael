/**
 * Copyright 2024
 *
 * Request
 *
 * Responsible for setting up the request to the API.
 */

import { HttpMethod, BASE_GRAPH_URL } from './constants';

export class TikTokRequest {
  protected accessToken: string;
  protected method: string;
  protected endpoint: string;
  protected params: Record<string, any>;
  protected headers: Record<string, string>;
  protected file?: { path: string; mime_type: string };
  protected url: string;

  constructor(
    method: string,
    endpoint: string = '',
    params: Record<string, any> = {},
    graphVersion: string = '',
    accessToken: string = ''
  ) {
    this.method = method.toUpperCase();
    this.endpoint = endpoint;
    this.params = params;
    this.accessToken = accessToken;
    this.headers = {};
    this.url = ''; // Inicializado aqui, será definido por setUrl abaixo
    this.setUrl(graphVersion);
  }

  /**
   * Set the full url for the request
   */
  setUrl(graphVersion: string, customUrl: string = ''): void {
    if (customUrl) {
      this.url = customUrl;
      return;
    }

    this.url = `${BASE_GRAPH_URL}/${graphVersion}${this.endpoint}`;

    // For GET requests, append params as query string
    if (this.method !== HttpMethod.POST && !customUrl) {
      const params = this.getParams();
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      this.url += `?${queryString}`;
    }
  }

  /**
   * Set request headers
   */
  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  /**
   * Return the headers for this request
   */
  getHeaders(): Record<string, string> {
    return this.headers;
  }

  /**
   * Set request file
   */
  setFile(file: { path: string; mime_type: string }): void {
    this.file = file;
  }

  /**
   * Return the file for this request
   */
  getFile(): { path: string; mime_type: string } | undefined {
    return this.file;
  }

  /**
   * Returns the body of the request
   */
  getUrlBody(): string {
    const params = this.getPostParams();
    return new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
  }

  /**
   * Return the params for this request
   */
  getParams(): Record<string, any> {
    const params = { ...this.params };
    if (this.accessToken) {
      params.access_token = this.accessToken;
    }
    return params;
  }

  /**
   * Return the HTTP method for this request
   */
  getMethod(): string {
    return this.method;
  }

  /**
   * Only return params on POST requests
   */
  getPostParams(): Record<string, any> {
    if (this.method === HttpMethod.POST) {
      return this.getParams();
    }
    return {};
  }

  /**
   * Return the endpoint URL this request
   */
  getUrl(): string {
    return this.url;
  }

  /**
   * Return the access token
   */
  getAccessToken(): string {
    return this.accessToken;
  }
}


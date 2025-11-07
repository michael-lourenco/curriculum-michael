/**
 * Copyright 2024
 *
 * HttpClient
 *
 * Handle HTTP functionality for requests.
 */

import { TikTokRequest } from './Request';
import { HttpMethod } from './constants';
import { ApiResponse } from './types';
import * as fs from 'fs';

export class HttpClient {
  /**
   * Perform an HTTP request
   */
  async send(request: TikTokRequest): Promise<ApiResponse> {
    const url = request.getUrl();
    const method = request.getMethod();
    const headers: Record<string, string> = { ...request.getHeaders() };

    // Add Authorization header if access token exists
    if (request.getAccessToken()) {
      headers['Authorization'] = `Bearer ${request.getAccessToken()}`;
    }

    const options: RequestInit = {
      method,
      headers,
    };

    // Handle POST requests
    if (method === HttpMethod.POST) {
      const postParams = request.getPostParams();
      
      // Set Content-Type for form data
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }

      // Build form data
      const formData = new URLSearchParams();
      Object.entries(postParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      options.body = formData.toString();
    }

    // Handle PUT requests (for file uploads)
    if (method === HttpMethod.PUT) {
      const file = request.getFile();
      if (file) {
        // Read file and convert to buffer
        const fileBuffer = fs.readFileSync(file.path);
        headers['Content-Type'] = file.mime_type;
        options.body = fileBuffer;
      }
    }

    try {
      const response = await fetch(url, options);
      const rawResponse = await response.text();
      
      // Parse JSON response
      let jsonResponse: ApiResponse;
      try {
        jsonResponse = JSON.parse(rawResponse);
      } catch (e) {
        // If response is not JSON, return error
        return {
          error: {
            code: 'INVALID_JSON',
            message: 'Invalid JSON response from API',
          },
        };
      }

      // Add debug info
      jsonResponse.debug = {
        url,
        method,
        status: response.status,
      };

      return jsonResponse;
    } catch (error: any) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred',
        },
      };
    }
  }
}


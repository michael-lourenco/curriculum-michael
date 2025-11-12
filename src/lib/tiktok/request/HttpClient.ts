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
      
      // Verificar se há objetos aninhados (como source_info, post_info, etc.)
      // Se houver, usar JSON em vez de form-urlencoded
      const hasNestedObjects = Object.values(postParams).some(value => 
        value !== null && 
        value !== undefined && 
        typeof value === 'object' && 
        !Array.isArray(value) && 
        !(value instanceof Date) &&
        !(value instanceof Buffer)
      );

      if (hasNestedObjects) {
        // Usar JSON para objetos aninhados (exemplo Python usa json=payload)
        headers['Content-Type'] = 'application/json; charset=UTF-8';
        options.body = JSON.stringify(postParams);
      } else {
        // Usar form-urlencoded para dados simples
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
        rawResponse: rawResponse.substring(0, 500), // Limitar tamanho do log
      };

      // Se o status HTTP não for 2xx, mas não houver erro no JSON, criar erro baseado no status
      if (!response.ok && !jsonResponse.error) {
        jsonResponse.error = {
          code: `HTTP_${response.status}`,
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

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


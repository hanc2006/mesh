import { SecuritySchemeObject } from 'openapi3-ts/oas31';

export function bearerAuth(description?: string): SecuritySchemeObject {
  return {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description
  };
}

export function basicAuth(description?: string): SecuritySchemeObject {
  return {
    type: 'http',
    scheme: 'basic',
    description
  };
}

export function apiKeyAuth(options: any, description?: string): SecuritySchemeObject {
  return {
    type: 'apiKey',
    description,
    ...options
  };
}

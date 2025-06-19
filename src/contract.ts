import { ZodSchema, ZodTypeAny, z } from 'zod';
import type { ErrorCode } from './errors';

export interface ZodShape {
  [key: string]: ZodTypeAny;
}

export const response = (
  contentType: string,
  schema: ZodSchema,
  description?: string
) => ({
  content: { [contentType]: { schema } },
  description
});

export const json = (schema: ZodShape, description?: string) =>
  response('application/json', z.object(schema), description);

export const xml = (schema: ZodSchema, description?: string) =>
  response('application/xml', schema, description);

export const text = (schema: ZodSchema, description?: string) =>
  response('text/plain', schema, description);

export const err = (...codes: ErrorCode[]) => codes;

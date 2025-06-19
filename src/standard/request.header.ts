import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http2';
import { ZodType, ZodUnion, z } from 'zod';
import { keyof, ZodArray, ZodString } from 'zod/v4';
import { partial } from 'zod/v4-mini';
import { ZodShape } from '../contract';

export type IncomingHeaders = {
  [K in keyof IncomingHttpHeaders as string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K]: IncomingHttpHeaders[K];
};

type c = keyof IncomingHeaders;

export type OutgoingHeaders = {
  [K in keyof OutgoingHttpHeaders as string extends K
    ? never
    : number extends K
      ? never
      : symbol extends K
        ? never
        : K]: OutgoingHttpHeaders[K];
};

export type Headers = {
  [K in keyof IncomingHeaders]?: ZodType<string | string[] | undefined>;
};

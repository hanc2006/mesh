import { getUserContract } from './example-contract';
import { ClassEndpoint } from '../endpoint/class-endpoint';
import { middleware, Middleware } from '../middleware/index';

const auth = middleware()
  .options<{ required: boolean }>()
  .output<{ userId: string }>()
  .handler(async (ctx, opts) => {
    const token = ctx.headers.authorization;
    if (!token && opts.required) {
      throw new Error('Missing token');
    }
    return { userId: 'abc-123' };
  });

const geoMiddleware: Middleware<any, { region: string }> = async ctx => {
  const region = ctx.query.region ?? 'eu-central';
  return { region };
};

class GetUserEndpoint extends ClassEndpoint<typeof getUserContract> {
  contract = getUserContract;

  async handler(ctx) {
    if (!ctx.params.id) {
      return ctx.error('ERR_FROM_PDF_API');
    }
    return {
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date().toISOString()
    };
  }
}

export const getUserEndpoint = new GetUserEndpoint().build();

class GetUserWithMiddlewareEndpoint extends ClassEndpoint<
  typeof getUserContract
> {
  contract = getUserContract;

  async handler(ctx) {
    ctx.data.userId;
    ctx.data.region;
    if (!ctx.params.id) {
      return ctx.error('ERR_FROM_PDF_API');
    }
    return {
      id: ctx.params.id,
      user: ctx.data.userId,
      region: ctx.data.region
    };
  }
}

export const getUserWithMiddleware = new GetUserWithMiddlewareEndpoint()
  .use([auth({ required: true }), geoMiddleware])
  .build();

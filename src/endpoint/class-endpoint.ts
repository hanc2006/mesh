import { Context } from "../context/index";
import {
  InferSuccessResponse,
  Method,
  SchemaContract,
} from "../contract/index";
import {
  MergeMiddlewareOutput,
  Middleware,
  MiddlewareContext,
} from "../middleware/index";
import { RouterBuilder } from "../router";

/**
 * Base class for defining endpoints using class inheritance.
 * Subclasses provide the contract and implement the `handler` method.
 */
export abstract class ClassEndpoint<
  C extends SchemaContract<Method, any, any, any, any>,
  D extends object = {}
> {
  /** The SchemaContract describing this endpoint. */
  public abstract contract: C;

  protected middlewares: Middleware<MiddlewareContext<C, D>, any>[] = [];

  /** Attach one or more middlewares to this endpoint. */
  use<M extends Middleware<MiddlewareContext<C, D>, any>>(
    middleware: M
  ): ClassEndpoint<C, D & Awaited<ReturnType<M>>>;
  use<M extends Middleware<MiddlewareContext<C, D>, any>[]>(
    middleware: M
  ): ClassEndpoint<C, D & MergeMiddlewareOutput<M>>;
  use(
    middleware:
      | Middleware<MiddlewareContext<C, D>, any>
      | Middleware<MiddlewareContext<C, D>, any>[]
  ): ClassEndpoint<C, D> {
    if (Array.isArray(middleware)) {
      this.middlewares.push(...middleware);
      return this as unknown as ClassEndpoint<
        C,
        D & MergeMiddlewareOutput<typeof middleware>
      >;
    }
    this.middlewares.push(middleware);
    return this as unknown as ClassEndpoint<
      C,
      D & Awaited<ReturnType<typeof middleware>>
    >;
  }

  /** Attach all middlewares from a router. */
  router<R extends ReturnType<InstanceType<typeof RouterBuilder<D>>["build"]>>(
    router: R
  ): ClassEndpoint<C, D & MergeMiddlewareOutput<R["middlewares"]>> {
    this.middlewares.push(...router.middlewares);
    return this as unknown as ClassEndpoint<
      C,
      D & MergeMiddlewareOutput<R["middlewares"]>
    >;
  }

  /**
   * Handle the request for this endpoint.
   * The context type is derived from the endpoint's contract and middlewares.
   */
  public abstract handler(
    ctx: Context<C, D>
  ): Promise<InferSuccessResponse<C>>;

  /**
   * Build the EndpointHandler structure consumed by the Server.
   */
  build() {
    return {
      contract: this.contract,
      middlewares: this.middlewares,
      handler: this.handler.bind(this),
    };
  }
}

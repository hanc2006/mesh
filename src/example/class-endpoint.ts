import { getUserContract } from "./example-contract";
import { ClassEndpoint } from "../endpoint/class-endpoint";

class GetUserEndpoint extends ClassEndpoint<typeof getUserContract> {
  contract = getUserContract;

  async handler(ctx) {
    if (!ctx.params.id) {
      return ctx.error("ERR_FROM_PDF_API");
    }
    return {
      id: "123",
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: new Date().toISOString(),
    };
  }
}

export const getUserEndpoint = new GetUserEndpoint().build();

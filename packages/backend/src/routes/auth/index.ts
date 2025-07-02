import { FastifyInstance } from "fastify";
import * as AuthController from "./controller";
import { loginSchema } from "./schema";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", {
    schema: loginSchema,
    handler: AuthController.login,
  });
}

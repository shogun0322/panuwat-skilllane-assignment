import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET || "your-secret",
  });

  fastify.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});

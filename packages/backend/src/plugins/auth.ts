import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance } from "fastify";

export default fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "panuwat",
  });

  fastify.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});

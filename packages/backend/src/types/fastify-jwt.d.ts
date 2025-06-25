import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    jwt: import("@fastify/jwt").FastifyJWT;
  }
}

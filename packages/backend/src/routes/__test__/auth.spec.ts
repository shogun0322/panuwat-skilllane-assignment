import Fastify from "fastify";

import { User } from "../../models";
import { hashPassword } from "../../utils/password";
import authRoutes from "../../routes/auth";
import fastifyJwt from "@fastify/jwt";
// ...
import supertest from "supertest";

const buildFastify = () => {
  const fastify = Fastify();

  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(fastifyJwt, { secret: "panuwat" });

  return fastify;
};

describe("POST /auth/login", () => {
  let passwordHash: string;
  const email = "test@example.com";
  const password = "password";

  beforeAll(async () => {
    passwordHash = await hashPassword(password);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login with correct credentials", async () => {
    jest.spyOn(User, "findOne").mockResolvedValue({
      get: () => ({
        id: 1,
        email,
        password: passwordHash,
      }),
    } as any);

    const fastify = buildFastify();
    await fastify.ready();

    const res = await supertest(fastify.server)
      .post("/auth/login")
      .send({ email, password })
      .expect(200);

    expect(typeof res.body.accessToken).toBe("string");
    await fastify.close();
  });
});

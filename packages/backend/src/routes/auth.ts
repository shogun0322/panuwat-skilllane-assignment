import { FastifyInstance } from "fastify";

const user = { id: 1, username: "test", password: "password" };

export default async function (fastify: FastifyInstance) {
  fastify.post("/auth/login", async (req, reply) => {
    const { username, password } = req.body as any;
    if (username === user.username && password === user.password) {
      const token = fastify.jwt.sign({ id: user.id, username: user.username });
      return { accessToken: token };
    }
    reply.code(401).send({ message: "Invalid credentials" });
  });
}

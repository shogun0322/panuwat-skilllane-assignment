import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { User } from "../models";
import { verifyPassword } from "../utils/password";

interface LoginBody {
  email: string;
  password: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      schema: {
        description: "Login",
        tags: ["auth"],
        summary: "User login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      try {
        const { email, password } = req.body;

        const userData = await User.findOne({ where: { email } });
        if (!userData) {
          await new Promise((res) => setTimeout(res, 300));
          return reply.code(500).send({ message: "Invalid credentials" });
        }
        const { id, email: userEmail, password: userPassword } = userData.get();

        const isMatch = await verifyPassword(password, userPassword);
        if (!isMatch) {
          await new Promise((res) => setTimeout(res, 300));
          return reply.code(500).send({ message: "Invalid credentials" });
        }

        const token = fastify.jwt.sign({
          id,
          email: userEmail,
        });
        return reply.send({ accessToken: token });
      } catch (error) {
        fastify.log.error(error);
        return reply.code(500).send({ message: "Invalid credentials" });
      }
    }
  );
}

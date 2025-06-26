import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { User } from "../models";
import { hashPassword, verifyPassword } from "../utils/password";

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
            email: {
              type: "string",
              format: "email",
            },
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
          401: {
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

        if (!userData) throw new Error("Invalid credentials");
        const { id, email: userEmail, password: userPassword } = userData.get();

        const isMatch = await verifyPassword(password, userPassword);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = fastify.jwt.sign({
          id: id,
          email: userEmail,
        });
        return reply.send({ accessToken: token });
      } catch (error: any) {
        return reply.code(401).send({ message: error.message });
      }
    }
  );
}

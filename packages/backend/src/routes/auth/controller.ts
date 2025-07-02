import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../../models";
import { verifyPassword } from "../../utils/password";

interface LoginBody {
  email: string;
  password: string;
}

export async function login(
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await delayResponse();
      return reply.code(500).send({ message: "Invalid credentials" });
    }

    const { id, password: hashed } = user.get();
    const isMatch = await verifyPassword(password, hashed);
    if (!isMatch) {
      await delayResponse();
      return reply.code(500).send({ message: "Invalid credentials" });
    }

    const token = req.server.jwt.sign({ id, email });
    reply.send({ accessToken: token });
  } catch (error) {
    req.server.log.error(error);
    reply.code(500).send({ message: "Invalid credentials" });
  }
}

function delayResponse(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

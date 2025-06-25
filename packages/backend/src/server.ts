import Fastify from "fastify";
import authPlugin from "./plugins/auth";
// import dbPlugin from "./plugins/db";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";

const fastify = Fastify({ logger: true });

// fastify.register(dbPlugin);
fastify.register(authPlugin);
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(taskRoutes, { prefix: "/tasks" });

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});

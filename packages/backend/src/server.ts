import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import multipart from "@fastify/multipart";

import { sequelize } from "./db";
import authPlugin from "./plugins/auth";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";
import uploadRoutes from "./routes/upload";

const fastify = Fastify({ logger: false });

fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

fastify.register(swagger, {
  swagger: {
    info: {
      title: "Panuwat Suwanritdej",
      description: "Skilllane assignment => Panuwat Suwanritdej",
      version: "1.0.0",
    },
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

fastify.register(swaggerUI, { routePrefix: "/docs" });
fastify.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

fastify.register(authPlugin);

fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(taskRoutes, { prefix: "/tasks" });
fastify.register(uploadRoutes, { prefix: "/upload" });

fastify.get("/sync", async (request, reply) => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    console.log("Models:", Object.keys(sequelize.models));
    await sequelize.sync({ alter: true });
    reply.send({ ok: true, message: "Database synced" });
  } catch (err: any) {
    fastify.log.error(err);
    reply.status(500).send({ ok: false, error: err.message });
  }
});

fastify.get(
  "/",
  {
    schema: {
      description: "Health check",
      response: {
        200: {
          type: "object",
          properties: {
            ok: { type: "string" },
          },
        },
      },
    },
  },
  async (req, reply) => {
    return { ok: "pass" };
  }
);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await fastify.listen({ port: 50000 });
    console.log("Server started");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};
start();

import { FastifyInstance } from "fastify";
import * as TaskController from "./controller";
import * as TaskSchema from "./schema";

export default async function taskRoutes(fastify: FastifyInstance) {
  fastify.post("/create", {
    preHandler: [fastify.authenticate],
    schema: TaskSchema.createTask,
    handler: TaskController.createTask,
  });

  fastify.get("/list", {
    schema: TaskSchema.getTaskList,
    handler: TaskController.getTaskList,
  });

  fastify.get("/detail/:id", {
    schema: TaskSchema.getTaskDetail,
    handler: TaskController.getTaskDetail,
  });

  fastify.put("/:id", {
    schema: TaskSchema.updateTask,
    handler: TaskController.updateTask,
  });

  fastify.patch("/:id", {
    schema: TaskSchema.patchTaskStatus,
    handler: TaskController.patchTaskStatus,
  });

  fastify.delete("/:id", {
    schema: TaskSchema.deleteTask,
    handler: TaskController.deleteTask,
  });
}

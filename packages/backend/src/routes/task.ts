import { FastifyInstance } from "fastify";

let tasks: any[] = [];

export default async function (fastify: FastifyInstance) {
  //   fastify.addHook("preHandler", fastify.authenticate);

  // Create task
  fastify.post("/tasks", async (req, reply) => {
    const { title, description } = req.body as any;
    const task = {
      id: tasks.length + 1,
      title,
      description,
      isComplete: false,
      userId: req.user.id,
    };
    tasks.push(task);
    return task;
  });

  // Get all my tasks
  fastify.get("/tasks", async (req) => {
    return tasks.filter((t) => t.userId === req.user.id);
  });

  // Get task detail
  fastify.get("/tasks/:id", async (req, reply) => {
    const task = tasks.find(
      (t) => t.id === Number(req.params["id"]) && t.userId === req.user.id
    );
    if (!task) return reply.code(404).send({ message: "Not found" });
    return task;
  });

  // Update task
  fastify.put("/tasks/:id", async (req, reply) => {
    const idx = tasks.findIndex(
      (t) => t.id === Number(req.params["id"]) && t.userId === req.user.id
    );
    if (idx === -1) return reply.code(404).send({ message: "Not found" });
    tasks[idx] = { ...tasks[idx], ...req.body };
    return tasks[idx];
  });

  // Mark as complete/incomplete
  fastify.patch("/tasks/:id/complete", async (req, reply) => {
    const task = tasks.find(
      (t) => t.id === Number(req.params["id"]) && t.userId === req.user.id
    );
    if (!task) return reply.code(404).send({ message: "Not found" });
    task.isComplete = !!req.body.isComplete;
    return { message: "Status updated" };
  });

  // Delete task
  fastify.delete("/tasks/:id", async (req, reply) => {
    const idx = tasks.findIndex(
      (t) => t.id === Number(req.params["id"]) && t.userId === req.user.id
    );
    if (idx === -1) return reply.code(404).send({ message: "Not found" });
    tasks.splice(idx, 1);
    return { message: "Deleted" };
  });
}

import { FastifyInstance, FastifyRequest } from "fastify";

// 1. Task type
interface Task {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  userId: number;
}

// 2. ขยาย type ของ FastifyRequest ให้ req.user มี id
interface UserPayload {
  id: number;
  username?: string;
}

// 3. state
let tasks: Task[] = [];

// 4. API
export default async function (fastify: FastifyInstance) {
  // fastify.addHook("preHandler", fastify.authenticate);

  // Create task
  fastify.post("/tasks", async (req, reply) => {
    const { title, description } = req.body as {
      title: string;
      description: string;
    };

    // const task: Task = {
    //   id: tasks.length + 1,
    //   title,
    //   description,
    //   isComplete: false,
    //   userId: req.user.id,
    // };
    // tasks.push(task);
    // return task;
  });

  // Get all my tasks
  fastify.get("/tasks", async (req) => {
    return;
    // return tasks.filter((t) => t.userId === req.user.id);
  });

  // Get task detail
  fastify.get("/tasks/:id", async (req, reply) => {
    return;
    // const id = Number(req.params["id"]);
    // const task = tasks.find((t) => t.id === id && t.userId === req.user.id);
    // if (!task) return reply.code(404).send({ message: "Not found" });
    // return task;
  });

  // Update task
  fastify.put("/tasks/:id", async (req, reply) => {
    return;

    // const id = Number(req.params["id"]);
    // const idx = tasks.findIndex((t) => t.id === id && t.userId === req.user.id);
    // if (idx === -1) return reply.code(404).send({ message: "Not found" });

    // const update = req.body as Partial<Omit<Task, "id" | "userId">>;
    // tasks[idx] = { ...tasks[idx], ...update };
    // return tasks[idx];
  });

  // Mark as complete/incomplete
  fastify.patch("/tasks/:id/complete", async (req, reply) => {
    return;
    // const id = Number(req.params["id"]);
    // const task = tasks.find((t) => t.id === id && t.userId === req.user.id);
    // if (!task) return reply.code(404).send({ message: "Not found" });

    // const { isComplete } = req.body as { isComplete: boolean };
    // task.isComplete = !!isComplete;
    // return { message: "Status updated" };
  });

  // Delete task
  fastify.delete("/tasks/:id", async (req, reply) => {
    return;
    // const id = Number(req.params["id"]);
    // const idx = tasks.findIndex((t) => t.id === id && t.userId === req.user.id);
    // if (idx === -1) return reply.code(404).send({ message: "Not found" });
    // tasks.splice(idx, 1);
    // return { message: "Deleted" };
  });
}

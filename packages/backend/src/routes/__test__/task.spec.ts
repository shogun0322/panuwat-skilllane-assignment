import Fastify from "fastify";
import supertest from "supertest";
import taskRoutes from "../task";
import { Task } from "../../models";

jest.mock("../../models", () => ({
  User: { findByPk: jest.fn(), findOne: jest.fn() },
  Task: {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
}));

const fakeAuth = async (req: any, reply: any) => {
  req.user = { id: "1", email: "test@example.com" };
};

const buildFastify = async () => {
  const fastify = Fastify();
  fastify.decorate("authenticate", fakeAuth);
  await fastify.register(taskRoutes, { prefix: "/tasks" });
  await fastify.ready();
  return fastify;
};

describe("Task routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /tasks/create", () => {
    it("should create a task and return success", async () => {
      // Mock Task.create
      (Task.create as jest.Mock).mockResolvedValue({
        id: "task-id",
        user_id: "1",
        title: "Title",
        description: "desc",
        image: null,
        status: "INCOMPLETE",
      });

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .post("/tasks/create")
        .set("Authorization", "Bearer fake")
        .send({
          title: "Title",
          description: "desc",
          image: null,
          status: "INCOMPLETE",
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Task.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Title", user_id: "1" })
      );

      await fastify.close();
    });
  });

  describe("GET /tasks/list", () => {
    it("should return list of tasks", async () => {
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        rows: [
          {
            get: () => ({
              id: "task-1",
              title: "test",
              status: "INCOMPLETE",
              user: { id: "1", email: "test@example.com" },
            }),
          },
        ],
        count: 1,
      });

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .get("/tasks/list?page=1&limit=10")
        .set("Authorization", "Bearer fake")
        .expect(200);

      expect(Array.isArray(res.body.tasks)).toBe(true);
      expect(res.body.total).toBe(1);

      await fastify.close();
    });
  });

  describe("GET /tasks/detail/:id", () => {
    it("should return task detail", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue({
        id: "task-1",
        user_id: "1",
        title: "test",
        description: "desc",
        image: null,
        status: "INCOMPLETE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      });

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .get("/tasks/detail/task-1")
        .set("Authorization", "Bearer fake")
        .expect(200);

      expect(res.body.task.id).toBe("task-1");

      await fastify.close();
    });

    it("should return 500 if not found", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .get("/tasks/detail/not-found")
        .set("Authorization", "Bearer fake")
        .expect(500);

      expect(res.body.message).toMatch(/not found/i);

      await fastify.close();
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update a task", async () => {
      const updateMock = jest.fn();
      (Task.findByPk as jest.Mock).mockResolvedValue({
        update: updateMock.mockResolvedValue({}),
      });

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .put("/tasks/task-1")
        .send({
          title: "New",
          description: "New",
          image: null,
          status: "COMPLETE",
        })
        .set("Authorization", "Bearer fake")
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: "New" })
      );

      await fastify.close();
    });

    it("should return 500 if task not found", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .put("/tasks/task-99")
        .send({
          title: "x",
          description: "x",
          image: null,
          status: "INCOMPLETE",
        })
        .set("Authorization", "Bearer fake")
        .expect(500);

      expect(res.body.message).toMatch(/not found/i);

      await fastify.close();
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should patch status", async () => {
      const saveMock = jest.fn();
      (Task.findByPk as jest.Mock).mockResolvedValue({
        status: "INCOMPLETE",
        save: saveMock.mockResolvedValue({}),
      });

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .patch("/tasks/task-1")
        .send({ status: "COMPLETE" })
        .set("Authorization", "Bearer fake")
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(saveMock).toHaveBeenCalledWith();

      await fastify.close();
    });

    it("should return 500 if task not found", async () => {
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .patch("/tasks/task-99")
        .send({ status: "COMPLETE" })
        .set("Authorization", "Bearer fake")
        .expect(500);

      expect(res.body.message).toMatch(/not found/i);

      await fastify.close();
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      (Task.destroy as jest.Mock).mockResolvedValue(1);

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .delete("/tasks/task-1")
        .set("Authorization", "Bearer fake")
        .expect(200);

      expect(res.body.success).toBe(true);

      await fastify.close();
    });

    it("should return 500 if task not found", async () => {
      (Task.destroy as jest.Mock).mockResolvedValue(0);

      const fastify = await buildFastify();

      const res = await supertest(fastify.server)
        .delete("/tasks/task-999")
        .set("Authorization", "Bearer fake")
        .expect(500);

      expect(res.body.message).toMatch(/not found/i);

      await fastify.close();
    });
  });
});

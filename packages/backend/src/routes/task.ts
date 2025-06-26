import { Op } from "sequelize";
import { Task, User } from "../models";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function (fastify: FastifyInstance) {
  // CREATE
  fastify.post(
    "/create",
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: "Create new task",
        tags: ["task"],
        body: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            image: { type: "string", format: "uri", nullable: true },
          },
        },
        response: {
          200: { type: "object", properties: { success: { type: "boolean" } } },
          500: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as { id: string; email: string };
        const { title, description, image, status } = req.body as any;

        const task = await Task.create({
          user_id: user.id,
          title,
          description,
          image,
          status,
        });

        return reply.code(200).send({ success: true });
      } catch (error: any) {
        return reply.code(500).send({ message: error.message });
      }
    }
  );

  // GET LIST
  fastify.get(
    "/list",
    {
      schema: {
        description: "Get Task list",
        tags: ["task"],
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1, default: 1 },
            limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            title: { type: "string" },
            status: { type: "string", enum: ["INCOMPLETE", "COMPLETE"] },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    status: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                      },
                    },
                  },
                },
              },
              page: { type: "integer" },
              limit: { type: "integer" },
              total: { type: "integer" },
              totalPages: { type: "integer" },
            },
          },
          500: { type: "object", properties: { message: { type: "string" } } },
        },
      },
    },
    async (req, reply) => {
      try {
        const {
          page = 1,
          limit = 10,
          title,
          status,
        } = req.query as {
          page?: number;
          limit?: number;
          title?: string;
          status?: "INCOMPLETE" | "COMPLETE";
        };

        const where: any = {};
        if (title) where.title = { [Op.iLike]: `%${title}%` };
        if (status) where.status = status;

        const offset = (page - 1) * limit;

        const { rows, count } = await Task.findAndCountAll({
          where,
          limit,
          offset,
          order: [["created_at", "DESC"]],
          include: [
            {
              model: User,
              attributes: ["email"],
              as: "user",
            },
          ],
        });

        const tasks = rows.map((row: any) => {
          const task = row.get();
          return {
            ...task,
            user: task.user
              ? { id: task.user.id, email: task.user.email }
              : null,
          };
        });

        return reply.send({
          tasks,
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        });
      } catch (error: any) {
        return reply.code(500).send({ message: error.message });
      }
    }
  );

  // GET DETAIL
  fastify.get(
    "/detail/:id",
    {
      schema: {
        description: "Get task detail",
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              task: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  user_id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  image: { type: ["string", "null"] },
                  status: { type: "string" },
                  created_at: { type: "string", format: "date-time" },
                  updated_at: { type: "string", format: "date-time" },
                  deleted_at: { type: ["string", "null"] },
                },
                required: [
                  "id",
                  "user_id",
                  "title",
                  "description",
                  "status",
                  "created_at",
                  "updated_at",
                ],
                additionalProperties: false,
              },
            },
            required: ["task"],
          },
          500: { type: "object", properties: { message: { type: "string" } } },
        },
        tags: ["task"],
      },
    },
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = req.params;
        const task = await Task.findByPk(id, { raw: true });

        if (!task) throw new Error("Not found Task");
        console.log("shogun test ", task);

        return reply.code(200).send({ task });
      } catch (error: any) {
        return reply.code(500).send({ message: error.message });
      }
    }
  );

  // UPDATE (PUT)
  fastify.put(
    "/:id",
    {
      schema: {
        description: "Update a task by id",
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 1 },
            description: { type: "string", minLength: 1 },
            image: { type: ["string", "null"] },
            status: { type: "string" },
          },
          required: ["title", "description"],
        },
        response: {
          200: {
            type: "object",
            properties: { success: { type: "boolean" } },
            required: ["success"],
          },
          500: {
            type: "object",
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
        tags: ["task"],
      },
    },
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: any }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = req.params;
        const update = req.body;

        const task = (await Task.findByPk(id)) as any;
        if (!task) throw new Error("Task not found");

        await task.update(update);
        return reply.code(200).send({ success: true });
      } catch (error: any) {
        return reply.code(500).send({ message: error.message });
      }
    }
  );

  // PATCH UPDATE STATUS
  fastify.patch(
    "/:id",
    {
      schema: {
        description: "Mark a task as complete",
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: { success: { type: "boolean" } },
            required: ["success"],
          },
          500: {
            type: "object",
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
        tags: ["task"],
      },
    },
    async (
      req: FastifyRequest<{ Params: { id: string }; Body: any }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = req.params;
        const { status } = req.body as { status: "COMPLETE" | "INCOMPLETE" };

        const task = (await Task.findByPk(id)) as any;
        if (!task) throw new Error("Task not found");

        task.status = status;
        await task.save();

        return reply.code(200).send({ success: true });
      } catch (error: any) {
        return reply.code(500).send({ message: error.message });
      }
    }
  );

  // DELETE
  fastify.delete(
    "/:id",
    {
      schema: {
        description: "Delete a task by id",
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: { success: { type: "boolean" } },
            required: ["success"],
          },
          500: {
            type: "object",
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
        tags: ["task"],
      },
    },
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = req.params;
        const result = await Task.destroy({ where: { id } });
        if (result === 0) throw new Error("Task not found");
        return reply.code(200).send({ success: true });
      } catch (error: any) {
        return reply.code(500).send({ message: error.message });
      }
    }
  );
}

import { FastifyReply, FastifyRequest } from "fastify";
import { Op } from "sequelize";
import { Task, User } from "../../models";

// CREATE
export async function createTask(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user as { id: string };
    const { title, description, image, status } = req.body as any;

    await Task.create({ user_id: user.id, title, description, image, status });

    reply.code(200).send({ success: true });
  } catch (error: any) {
    reply.code(500).send({ message: error.message });
  }
}

// LIST
export async function getTaskList(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { page = 1, limit = 10, title, status } = req.query as any;
    const where: any = {};
    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (status) where.status = status;

    const offset = (page - 1) * limit;
    const { rows, count } = await Task.findAndCountAll({
      where,
      limit,
      offset,
      order: [["updated_at", "DESC"]],
      include: [{ model: User, attributes: ["email"], as: "user" }],
    });

    const tasks = rows.map((row: any) => {
      const task = row.get();
      return {
        ...task,
        user: task.user ? { id: task.user.id, email: task.user.email } : null,
      };
    });

    reply.send({
      tasks,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error: any) {
    reply.code(500).send({ message: error.message });
  }
}

// DETAIL
export async function getTaskDetail(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    console.log('shogun test', req.params);
    
    const task = await Task.findByPk(req.params.id, { raw: true });
    if (!task) throw new Error("Not found Task");

    reply.send({ task });
  } catch (error: any) {
    reply.code(500).send({ message: error.message });
  }
}

// UPDATE
export async function updateTask(
  req: FastifyRequest<{ Params: { id: string }; Body: any }>,
  reply: FastifyReply
) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new Error("Task not found");

    await task.update(req.body as any);
    reply.send({ success: true });
  } catch (error: any) {
    reply.code(500).send({ message: error.message });
  }
}

// PATCH STATUS
export async function patchTaskStatus(
  req: FastifyRequest<{ Params: { id: string }; Body: any }>,
  reply: FastifyReply
) {
  try {
    const { status } = req.body as any;
    const task = (await Task.findByPk(req.params.id)) as any;
    if (!task) throw new Error("Task not found");

    task.status = status;
    await task.save();

    reply.send({ success: true });
  } catch (error: any) {
    reply.code(500).send({ message: error.message });
  }
}

// DELETE
export async function deleteTask(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const result = await Task.destroy({ where: { id: req.params.id } });
    if (result === 0) throw new Error("Task not found");

    reply.send({ success: true });
  } catch (error: any) {
    reply.code(500).send({ message: error.message });
  }
}

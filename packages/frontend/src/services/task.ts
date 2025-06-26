import axiosCustom from "lib/axios";

interface TaskListQuery {
  page?: number;
  limit?: number;
  title?: string | null;
  status?: "INCOMPLETE" | "COMPLETE" | "";
}

export interface TaskDetailBody {
  id?: string;
  title: string;
  description: string;
  image?: string | null;
  status?: "INCOMPLETE" | "COMPLETE" | undefined | null;
}

interface TaskStatusBody {
  id?: string;
  status?: "INCOMPLETE" | "COMPLETE" | undefined | null;
}

export async function getTaskList(query: TaskListQuery) {
  const res = await axiosCustom.get("/tasks/list", {
    params: { ...query, status: query.status || null },
  });
  return res.data;
}

export async function getTaskDetail(id: string) {
  const res = await axiosCustom.get(`/tasks/detail/${id}`, {});
  return res.data;
}

export async function createTask(body: TaskDetailBody) {
  const res = await axiosCustom.post("/tasks/create", { body });
  return res.data;
}

export async function updateTaskStatus(body: TaskStatusBody) {
  const { id, status } = body;
  const res = await axiosCustom.patch(`/tasks/${id}`, { status });
  return res.data;
}

export async function updateTaskDetail(body: TaskDetailBody) {
  const { id } = body;
  const res = await axiosCustom.put(`/tasks/${id}`, body);
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await axiosCustom.delete(`/tasks/${id}`);
  return res.data;
}

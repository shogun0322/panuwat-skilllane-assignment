import { create } from "zustand";
import { getTaskDetail, getTaskList } from "services/task";

interface UserData {
  email: string;
}
interface TaskDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  user: UserData;
  image?: string | null;
}
interface TaskState {
  tasks: TaskDetail[];

  total: number;
  totalPages: number;

  page: number;
  limit: number;
  title: string | null;
  status: "INCOMPLETE" | "COMPLETE" | "";

  searchWithTitle: (input: string) => void;
  changeFilterStatus: (input: "INCOMPLETE" | "COMPLETE" | "") => void;

  changePage: (input: number) => void;
  changeLimit: (input: number) => void;

  getTaskList: (
    setAlert: (message: string, type: "success" | "error") => void,
    setLoad: () => void
  ) => void;

  getTaskDetailData: (
    id: string,
    setAlert: (message: string, type: "success" | "error") => void,
    setLoad: () => void
  ) => void;
}

export const taskStore = create<TaskState>((set, get) => ({
  tasks: [],

  total: 0,
  totalPages: 0,

  page: 1,
  limit: 10,
  title: null,
  status: "",

  getTaskList: async (setAlert, setLoad) => {
    try {
      setLoad();
      const { page, limit, title, status } = get();
      const query = { page, limit, title, status };
      const result = await getTaskList(query);
      setLoad();
      set({
        tasks: result.tasks,
        total: result.total,
        totalPages: result.totalPages,
      });
    } catch (error) {
      setLoad();
      setAlert("Failed to GET task list", "error");
    }
  },

  searchWithTitle: (input: string) => {
    set({ title: input, page: 1 });
  },

  changeFilterStatus: (input: "INCOMPLETE" | "COMPLETE" | "") => {
    set({ status: input, page: 1 });
  },

  changePage: (input: number) => set({ page: input }),
  changeLimit: (input: number) => set({ limit: input }),

  getTaskDetailData: async (id, setAlert, setLoad) => {
    try {
      setLoad();
      const data = await getTaskDetail(id);
      return data.task;
    } catch (e) {
      setAlert("Failed to GET task detail", "error");
    } finally {
      setLoad();
    }
  },
}));

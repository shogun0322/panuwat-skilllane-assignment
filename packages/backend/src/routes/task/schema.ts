export const createTask = {
  description: "Create new task",
  tags: ["task"],
  body: {
    type: "object",
    required: ["title", "description"],
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      image: { type: "string", format: "uri", nullable: true },
      status: {
        type: "string",
        enum: ["COMPLETE", "INCOMPLETE"],
        nullable: true,
      },
    },
  },
  response: {
    200: { type: "object", properties: { success: { type: "boolean" } } },
    500: { type: "object", properties: { message: { type: "string" } } },
  },
};

export const getTaskList = {
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
};

export const getTaskDetail = {
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
};

export const updateTask = {
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
};

export const patchTaskStatus = {
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
};

export const deleteTask = {
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
};

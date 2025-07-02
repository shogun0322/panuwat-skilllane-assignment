export const uploadImageSchema = {
  consumes: ["multipart/form-data"],
  response: {
    200: {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"],
    },
    400: {
      type: "object",
      properties: { error: { type: "string" } },
      required: ["error"],
    },
  },
};

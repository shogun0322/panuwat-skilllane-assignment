import { FastifyInstance } from "fastify";
import { uploadImage } from "./controller";
import { uploadImageSchema } from "./schema";

export default async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post("/image", {
    schema: uploadImageSchema,
    handler: uploadImage,
  });
}

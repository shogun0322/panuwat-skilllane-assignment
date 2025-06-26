import { Storage } from "@google-cloud/storage";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  type UploadResponse = { url: string };

  const gcpKey = process.env.GCP_SERVICE_ACCOUNT_KEY;
  if (!gcpKey) throw new Error("Missing GCP_SERVICE_ACCOUNT_KEY");

  const credentials = JSON.parse(gcpKey);

  const storage = new Storage({
    projectId: credentials.project_id,
    credentials,
  });

  const bucket = storage.bucket("test");

  fastify.post(
    "/image",
    {
      schema: {
        consumes: ["multipart/form-data"],
        response: {
          200: {
            type: "object",
            properties: { ok: { type: "boolean" } },
          },
        },
      },
    },
    async function (req: any, reply) {
      const file = await req.file();

      if (!file) return reply.code(400).send({ error: "No file uploaded" });
      if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
        return reply.code(400).send({ error: "Only PNG or JPEG allowed" });
      }

      const fileName = `${Date.now()}-${file.filename}`;
      const bucketFile = bucket.file(fileName);

      try {
        await bucketFile.save(await file.toBuffer(), {
          metadata: { contentType: file.mimetype },
          public: true,
        });

        const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        const response: UploadResponse = { url };
        reply.send(response);
      } catch (error) {
        console.error("Upload failed:", error);
        reply.code(500).send({ error: "Upload failed" });
      }
    }
  );
}

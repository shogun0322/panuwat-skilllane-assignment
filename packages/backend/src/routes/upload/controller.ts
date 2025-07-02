import { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "crypto";
import { bucket } from "../../utils/gcs";

export async function uploadImage(req: FastifyRequest, reply: FastifyReply) {
  let file;
  try {
    file = await req.file();
  } catch (err) {
    return reply.code(400).send({ error: "No file uploaded" });
  }
  if (!file) return reply.code(400).send({ error: "No file uploaded" });
  if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
    return reply.code(400).send({ error: "Only PNG or JPEG allowed" });
  }

  const fileName = randomUUID();
  const bucketFile = bucket.file(fileName);

  try {
    await bucketFile.save(await file.toBuffer(), {
      metadata: { contentType: file.mimetype },
      // public: true,
    });

    const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    reply.send({ url });
  } catch (error) {
    console.error("Upload failed:", error);
    reply.code(500).send({ error: "Upload failed" });
  }
}

import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: "hop-dating-file",
  keyFilename: "./src/service-account.json",
});

export const bucket = storage.bucket("your-bucket-name");

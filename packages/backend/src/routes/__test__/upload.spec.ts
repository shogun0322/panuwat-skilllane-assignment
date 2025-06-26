import Fastify from "fastify";
import uploadRoute from "../upload";
import supertest from "supertest";
import path from "path";

describe("POST /upload/image", () => {
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    process.env.GCP_SERVICE_ACCOUNT_KEY = JSON.stringify({
      type: "service_account",
      project_id: "dummy",
      private_key_id: "dummy",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEv...dummy\n-----END PRIVATE KEY-----\n",
      client_email: "dummy@test.iam.gserviceaccount.com",
      client_id: "dummy",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/dummy",
    });
    app = Fastify();
    await app.register(uploadRoute);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should reject if no file uploaded", async () => {
    const response = await supertest(app.server).post("/image").expect(400);
    expect(response.body.error).toBe("No file uploaded");
  });

  it("should reject non-image file", async () => {
    const response = await supertest(app.server)
      .post("/image")
      .attach("file", Buffer.from("not an image"), "test.txt")
      .expect((res) => {
        if (![400, 415].includes(res.status)) {
          throw new Error(`Unexpected status ${res.status}`);
        }
      });
  });
});

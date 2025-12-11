import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/ping", () => "pong") // Health Check
  .get("/hello/:name", ({ params }) => `Hello ${params.name}!`)
  .listen(3000);

console.log(`🟢 Server is running at http://localhost:3000`);

import { Elysia } from "elysia";

const app = new Elysia()
    .get("/ping", () => "pong")

    .get("/hello/:name", ({ params }) => {
        return `Hello, ${params.name}!`;
    })

    .get("/hello", ({ query }) => {
        return `Hello ${query.name}, age: ${query.age}`;
    })

    .listen(3000);

console.log(`http://localhost:3000`);

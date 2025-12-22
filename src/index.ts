import { Elysia } from 'elysia';
import { auth } from './auth';

const app = new Elysia()
    .get('/', () => 'Hello Elysia')
    // Lúc này app sẽ có thêm các route: /auth/register, /auth/login...
    .use(auth) 
    
    .listen(process.env.PORT || 3000);

console.log(`🦊 Server is running at ${app.server?.hostname}:${app.server?.port}`);
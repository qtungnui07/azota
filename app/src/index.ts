import { Elysia, t } from 'elysia';
const users = new Map();

const app = new Elysia()
  .post('/register', async ({ body, set }) => {
    const { name, email, username, password } = body;
    // Kiểm tra Username bằng .get()
    // Nếu users.get(username) trả về dữ liệu => Username đã tồn tại
    const existingUserByUsername = users.get(username);
    
    if (existingUserByUsername) {
      set.status = 401; // https://http.cat/401
      return { message: 'Username đã tồn tại!' };
    }

    // Kiểm tra Email (Phải duyệt qua values vì Map không get được theo email)
    for (const user of users.values()) {
      if (user.email === email) {
        set.status = 401;
        return { message: 'Email đã tồn tại!' };
      }
    }
    // Hash password
    const hashedPassword = await Bun.password.hash(password);

    // Tạo object user
    const newUser = {
      name,
      email,
      username,
      password: hashedPassword
    };
    // Sử dụng .set() như gợi ý để lưu vào Map
    // Key là username, Value là object user
    users.set(username, newUser);

    set.status = 201; // https://http.cat/201
    return {
      status: 201,
      message: 'Đăng ký thành công',
      data: { name, email, username }
    };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      username: t.String(),
      password: t.String()
    })
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
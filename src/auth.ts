import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";

// Khởi tạo "Database" cục bộ cho module Auth
// Lưu ý: Nếu muốn dùng biến users này ở file khác, bạn nên tách nó ra file riêng (vd: store.ts)
const users = new Map();

export const auth = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECERT || "qtitpc",
    }),
  )
  // --- Route: /auth/register ---
  .post(
    "/register",
    async ({ body, set }) => {
      const { name, email, username, password } = body;

      // 1. Check trùng
      const existingUser = users.get(username);
      // Check email (duyệt values)
      const emailExists = Array.from(users.values()).some(
        (u) => u.email === email,
      );

      if (existingUser || emailExists) {
        set.status = 401;
        return { message: "Username hoặc Email đã tồn tại!" };
      }

      // 2. Hash password
      const hashedPassword = await Bun.password.hash(password);

      // 3. Save
      const newUser = { name, email, username, password: hashedPassword };
      users.set(username, newUser);

      set.status = 201;
      return { message: "Đăng ký thành công", user: { username, name } };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        username: t.String(),
        password: t.String(),
      }),
    },
  )

  // --- Route: /auth/login (Placeholder) ---
  .post(
    "/login",
    async ({ body, set, jwt }) => {
      const { username, password } = body;

      // 1. Tìm user trong Map
      const user = users.get(username);
      if (!user) {
        set.status = 401;
        return { message: "Sai Username hoặc Password" };
      }

      // 2. So sánh password (Input vs Hashed)
      const isMatch = await Bun.password.verify(password, user.password);
      if (!isMatch) {
        set.status = 401;
        return { message: "Sai Username hoặc Password" };
      }

      // 3. Tạo Token (JWT Sign)
      // Payload là thông tin ta muốn giấu trong vé (ví dụ: username, name)
      const token = await jwt.sign({
        username: user.username,
        name: user.name,
      });

      return {
        message: "Đăng nhập thành công",
        token: token, // Trả về chuỗi JWT cho client
      };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  )

  // --- PROFILE (Mới) ---
  .get("/profile", async ({ headers, set, jwt }) => {
    // 1. Lấy header Authorization
    const authHeader = headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      return { message: "Thiếu Token hoặc sai định dạng Bearer" };
    }

    // 2. Tách lấy token (Bỏ chữ "Bearer " đi)
    // "Bearer eyJhbGci..." -> lấy phần "eyJhbGci..."
    const token = authHeader.split(" ")[1];

    // 3. Giải mã và xác thực (Verify)
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401; // Token hết hạn hoặc chữ ký sai
      return { message: "Token không hợp lệ" };
    }

    // 4. Trả về thông tin (Payload)
    return {
      message: "Đây là thông tin mật của bạn",
      profile: payload,
    };
  });

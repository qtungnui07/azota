import { Elysia, t } from 'elysia';

// Khởi tạo "Database" cục bộ cho module Auth
// Lưu ý: Nếu muốn dùng biến users này ở file khác, bạn nên tách nó ra file riêng (vd: store.ts)
const users = new Map();

export const auth = new Elysia({ prefix: '/auth' })
    // --- Route: /auth/register ---
    .post('/register', async ({ body, set }) => {
        const { name, email, username, password } = body;

        // 1. Check trùng
        const existingUser = users.get(username);
        // Check email (duyệt values)
        const emailExists = Array.from(users.values()).some(u => u.email === email);

        if (existingUser || emailExists) {
            set.status = 401;
            return { message: 'Username hoặc Email đã tồn tại!' };
        }

        // 2. Hash password
        const hashedPassword = await Bun.password.hash(password);

        // 3. Save
        const newUser = { name, email, username, password: hashedPassword };
        users.set(username, newUser);

        set.status = 201;
        return { message: 'Đăng ký thành công', user: { username, name } };
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            username: t.String(),
            password: t.String()
        })
    })

    // --- Route: /auth/login (Placeholder) ---
    .post('/login', () => {
        return 'Chức năng đăng nhập sẽ làm sau';
    })

    // --- Route: /auth/profile (Placeholder) ---
    .get('/profile', () => {
        return 'Thông tin user sẽ hiện ở đây';
    });
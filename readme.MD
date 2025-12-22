bun install
bun run dev and test w/ yaak
bun add -d prisma 
bun add @prisma/client
bun prisma init --datasource-provider sqlite


bun prisma migrate dev --name init_user_table
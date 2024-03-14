FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm i -g pnpm@8.15.4

RUN pnpm install --ignore-scripts
RUN pnpm build

CMD ["node", "dist/server.js"]

EXPOSE 3000
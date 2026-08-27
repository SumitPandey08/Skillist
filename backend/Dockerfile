FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN if [ -f .env ]; then \
			set -a && . .env && set +a; \
		fi && npx prisma generate

RUN if [ -f .env ]; then \
			set -a && . .env && set +a; \
		fi && npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]

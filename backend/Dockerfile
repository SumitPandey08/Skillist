FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN if [ -f .env ]; then \
			set -a && . .env && set +a; \
		fi && npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]

FROM node:16
WORKDIR /app
ENV PORT=3000
ENV DB_USER=postgres
ENV DB_HOST=final-project-db
ENV DB_NAME=final-project-db
ENV DB_PASSWORD=docker
ENV DB_PORT=5432
COPY package*.json ./
RUN npm install
COPY src/ src/
EXPOSE 3000
CMD ["node", "src/index.js"]
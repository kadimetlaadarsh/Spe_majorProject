FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Create uploads dir inside container (optional – config/storage also handles)
RUN mkdir -p uploads/scans

EXPOSE 4200
CMD ["node", "server.js"]

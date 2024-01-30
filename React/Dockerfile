FROM node:18-alpine

WORKDIR /usr/app

COPY package*.json ./

# RUN npm install
# RUN npm run build
# RUN npm run preview

RUN npm ci -qy

COPY . .

EXPOSE 5001

CMD ["npm", "start"]
FROM node:16.19.0

WORKDIR $HOME/pm2-web-ui

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]

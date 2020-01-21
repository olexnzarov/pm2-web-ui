const config = {
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pm2-web-ui',
  salt: process.env.SALT || 'i am dumb',
};

export default config;
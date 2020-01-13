const config = {
  // this is a local database that is used for the development
  // you can't access it externally, so no worries :)
  mongodbUri: process.env.MONGODB_URI || 'mongodb://pm2:pm2@192.168.1.218:27017/pm2-web-ui',
  salt: process.env.SALT || 'i am dumb',
};

export default config;
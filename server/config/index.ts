const config = {
  mongodbUri: process.env.MONGODB_URI,
  salt: process.env.SALT || 'i am dumb',
};

export default config;
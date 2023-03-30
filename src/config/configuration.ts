export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.MONGODB_URI,
  },
  facebook: {
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
  },
  appUrl: process.env.APP_URL,
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_H,
});

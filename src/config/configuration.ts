export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.MONGODB_URI,
  },
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_H,
});

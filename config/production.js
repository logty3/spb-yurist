module.exports = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  OUT_MAIL: process.env.OUT_MAIL,
  TO_MAIL: process.env.TO_MAIL,
  PASSWORD: process.env.PASSWORD,
  NODE_ENV: process.env.NODE_ENV,
  REWIEWS_PER_PAGE: process.env.REWIEWS_PER_PAGE,
  POSTS_PER_PAGE: process.env.POSTS_PER_PAGE,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
  API_SERVER: `${process.env.API_SERVER}/api`,
};

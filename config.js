module.exports = (() => {
  const config = {
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    server: {
      host: process.env.SERVER_HOST,
      port: process.env.SERVER_PORT,
    },
  };
  return config;
})();

module.exports = (() => {
  const config = {
    database: {
      host: process.env.DATABASE_HOST || "localhost",
      port: process.env.DATABASE_PORT || 5432,
      user: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD || "root",
      database: process.env.DATABASE || "test",
    },
    server: {
      host: process.env.SERVER_HOST || "localhost",
      port: process.env.SERVER_PORT || 6000,
    },
  };
  return config;
})();

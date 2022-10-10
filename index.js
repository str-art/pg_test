const path = require("path");

const libPath = path.join(__dirname, "lib");

require(path.join(__dirname, "cleanup"));

const App = require(path.join(libPath, "App"));
const config = require(path.join(__dirname, "config"));

const [, , env = "development"] = process.argv;

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = env;
}

(async () => {
  try {
    const app = new App(config);
    await app.connectToDB();
  } catch (error) {
    console.error(error);
    cleanUpExit();
  }
})();

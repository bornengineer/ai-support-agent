import { config } from "./config";
import app from "./app";
import { initRedis } from "./services/redis";

const PORT = config.port || 4000;

initRedis().then(() => {
  app.listen(PORT, () => console.log(`Running on ${PORT}`));
});

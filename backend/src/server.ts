import { config } from "../config";
import app from "./app";
const PORT = config.port || 4000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));

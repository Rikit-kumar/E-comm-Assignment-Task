import app from "./app/app.js";
import { connectDatabase } from "./config/db.js";

await connectDatabase();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

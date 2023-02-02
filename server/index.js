
import app from './server.js';
import * as dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Started server at localhost: ${port}`);
});
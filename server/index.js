
import app from './server.js';
import * as dotenv from 'dotenv'

dotenv.config();
const port = process.env.port;

app.listen(port, () => {
  console.log(`Started server at localhost: ${port}`);
});
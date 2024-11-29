import express, { Express } from "express";
import { updateEvent, fetchEventDetails, retrieveEvents } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/update", updateEvent);
app.get("/api/fetch", fetchEventDetails);
app.get("/api/names", retrieveEvents);
app.listen(port, () => console.log(`Server listening on ${port}`));

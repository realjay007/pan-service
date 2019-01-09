import { default as express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import logger from "./util/logger";
import dotenv from "dotenv";
import util from "util";
import mongoose from "mongoose";
import bluebird from "bluebird";
import cors from "cors";
import { MONGODB_URI } from "./util/secrets";
import router from "./routes";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl).then(() => {
	/** ready to use. The `mongoose.connect()` promise resolves to undefined. */
})
.catch(err => {
	console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
	// process.exit();
});

app.set("json spaces", 4);

// Trust reverse proxy
app.set("trust proxy", true);

// CORS
app.use(cors());

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Application routes
app.use(router);

// Error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
	logger.debug(util.inspect(err, true, 5));
	if(!res.headersSent) {
		res.status(500).json({
			status: 500,
			success: false,
			message: "An error occurred while processing your request"
		});
	}
});

export default app;

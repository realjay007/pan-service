import { default as express, Request, Response, NextFunction} from "express";
import moment from "moment";

// Pan controller
import * as PanController from "../controllers/pan"

const router = express.Router();

const app_start = moment().unix();

/**
 * Default route
 */
router.all("/", (req: Request, res: Response, next: NextFunction) => {
	res.json({
		status: 200,
		success: true,
		message: "Hello world",
		data: {
			app_start
		}
	});
});

// Create pan
router.post("/pan", PanController.createPan);

// Get all pans
router.get("/pan", PanController.getPans);

// Get pan by id
router.get("/pan/:pan_id", PanController.getPan);

// Delete pan
router.delete("/pan/:pan_id", PanController.deletePan);

export default router;

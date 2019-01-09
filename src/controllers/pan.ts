import { Request, Response, NextFunction } from "express";

import Pan, { PanModel } from "../models/pan";
import * as PanLib from "../libraries/pan";

/** create pan */
export function createPan(req: Request, res: Response, next: NextFunction) {
	const body = req.body;
	
	// Check if card exists and is valid
	if(!body.pan) {
		return res.status(400).json({
			status: false,
			message: "PAN is required"
		})
	}
	else if(!PanLib.validCardNumber(body.pan)) {
		return res.status(400).json({
			status: false,
			message: "Invalid PAN"
		})
	}

	// Get card type
	let card_num: string = body.pan;
	card_num = card_num.replace(/\D/g, '');
	let card_type = PanLib.getCardType(card_num);

	// Store pan in db
	let pan: PanModel = new Pan({
		pan: card_num,
		brand: card_type
	});

	Pan.generatePanId()
	.then((pan_id) => {
		pan.pan_id = pan_id;
		return pan.save();
	})
	.then(() => {
		res.json({
			status: true,
			message: "PAN stored successfully",
			data: {
				pan
			}
		})
	})
	.catch(next);
}

/** Get pans stored in db */
export function getPans(req: Request, res: Response, next: NextFunction) {
	Pan.find()
	.then((pans) => {
		res.json({
			status: true,
			data: pans
		})
	})
	.catch(next);
}

/** Get pan by id */
export function getPan(req: Request, res: Response, next: NextFunction) {
	let pan_id = req.params.pan_id;

	Pan.findOne({ pan_id })
	.then((pan) => {
		if(pan) {
			res.json({
				status: true,
				data: {
					pan
				}
			})
		}
		else {
			res.status(404).json({
				status: false,
				message: "PAN not found"
			})
		}
	})
}

/** Delete pan by id */
export function deletePan(req: Request, res: Response, next: NextFunction) {
	let pan_id = req.params.pan_id;

	Pan.findOne({ pan_id })
	.then((pan) => {
		if(pan) {
			let result = pan.remove()
				.then(() => {
					res.json({
						status: true,
						message: "PAN deleted successfully"
					})
				});
			return result;
		}
		else {
			res.status(404).json({
				status: false,
				message: "PAN not found"
			})
		}
	})
}

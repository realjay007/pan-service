import mongoose from "mongoose";
import randomstring from "randomstring";

import Utils from "../libraries/utils"


export type PanModel = mongoose.Document & {
	pan_id: string,

	pan: string,
	brand: string
}

export interface IPanModel extends mongoose.Model<PanModel> {
	/** Generate pan id */
	generatePanId(): Promise<string>
}

const Schema = new mongoose.Schema(
	{
		pan_id: String,

		pan: String,
		brand: String
	},
	{
    timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
  }
)

Schema.statics.generatePanId = async function (): Promise<string> {
	let pan_id: string;
	do {
		pan_id = randomstring.generate({
			length: 8,
			charset: "numeric"
		})
	}
	while(await Pan.findOne({ pan_id }).exec());

	return pan_id;
}

Schema.methods.toJSON = function (): any {
	let obj = this.toObject();
	obj = Utils.blackFields(obj, ["_id", "__v"]);
	return obj;
};

const Pan = <IPanModel> mongoose.model("Pan", Schema);
export default Pan;

import m_ from "minified-headless";
import * as secrets from "../util/secrets";
import validate from "validate.js";

const Utils = {
	/**
	 * Clone an object
	 */
	clone(obj: any): any {
		const new_obj = {};
		m_.copyObj(obj, new_obj);
		return new_obj;
	},

	/** 
	 * Check if a value is empty
	 */
	empty(value: any): boolean {
		return validate.isEmpty(value);
	},

	/**
	 * Return an object or null if no fields exists
	 */
	objOrNull(obj: any): any|null {
		if(this.empty(obj)) return null;
		else return obj;
	},

	/** 
	 * Exclude certain fields from object, returns new object without exclude fields
	 */
	blackFields(obj: any, fields: Array<string>): any {
		return m_.filterObj(obj, (key: string, value: any) => {
			return !m_.contains(fields, key);
		}, null);
	},

	/** 
	 * Return new object with keys that are in fields 
	 */
	whiteFields(obj: any, fields: Array<string>): any {
		return m_.filterObj(obj, (key: string, value: any) => {
			return m_.contains(fields, key);
		}, null);
	},

	/**
	 * Check if object has certain keys
	 */
	hasKeys(obj: any, keys: Array<string>): boolean {
		const l = keys.length;
		for(let i = 0; i < l; ++i) {
			if(!(keys[i] in obj)) return false;
		}
		return true;
	},

	/**
	 * Check if a value is numeric
	 */
	isNumeric(value: any): boolean {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},

	/** 
	 * Check if application is live
	 */
	isLive(): boolean {
		return secrets.ENVIRONMENT !== "development";
	},

	/**
	 * Remove non printable characters from string and trim
	 */
	removeNonPrint(str: string, trim: boolean = true): string {
		str = str.toString().replace(/[^\x20-\x7E]+/g, "");
		return trim? str.trim() : str;
	},

	/**
	 * Get random number between two numbers
	 */
	rand(a: number, b: number): number {
		return parseInt((Math.abs(a-b) * Math.random()).toString())+Math.min(a,b);
	},

	/** Check if a string is an email */
	isEmail(str: string): boolean {
		if(validate.single(str, {presence: true, email: true})) return false;
		else return true;
	}
};


export default Utils;

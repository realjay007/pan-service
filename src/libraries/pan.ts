import { getTypeInfo } from "credit-card-type";

interface CardTypeChecker {
	(card_num: string): boolean
}

/** Map of functions to check the card type */
const CardNumberTypeMap: {[type: string]: CardTypeChecker} = {
	"American Express": (card_num: string): boolean => {
		return card_num.match(/^3[47]/) != null;
	},
	"Mastercard": (card_num: string): boolean => {
		return /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(card_num)
	},
	"UnionPay": (card_num: string): boolean => {
		let bin = parseInt(card_num.substring(0, 6));
		if(bin >= 810000 && bin <= 817199) return true;
		return false;
	},
	"Verve": (card_num: string): boolean => {
		let bin = parseInt(card_num.substring(0, 6));
		if(bin >= 506099 && bin <= 506198) return true;
		if(bin >= 650002 && bin <= 650027) return true;
		return false;
	},
	"Visa": (card_num: string): boolean => {
		return card_num.match(/^4/) != null;
	},
};

/** Check if card is valid */
export function validCardNumber(value: string): boolean {
	// accept only digits, dashes or spaces
	if (/[^0-9-\s]+/.test(value)) return false;

	// The Luhn Algorithm. It's so pretty.
	let nCheck = 0, bEven = false;
	value = value.replace(/\D/g, "");

	for (let n = value.length - 1; n >= 0; n--) {
		let cDigit = value.charAt(n),
			  nDigit = parseInt(cDigit, 10);

		if (bEven) {
			if ((nDigit *= 2) > 9) nDigit -= 9;
		}

		nCheck += nDigit;
		bEven = !bEven;
	}

	return (nCheck % 10) == 0;
}

/** Return the card type as a string */
export function getCardType(card_num: string): string {
	card_num = card_num.replace(/\D/g, '');
	for(let type in CardNumberTypeMap) {
		let check = CardNumberTypeMap[type];
		if(check(card_num)) return type;
	}
	return "unknown";
}

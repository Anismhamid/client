export interface DecodedGooglePayload {
	sub: string;
	email?: string;
	name?: {first: string; last: string};
	picture?: string;
	slug?: string;
}

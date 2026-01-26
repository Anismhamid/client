export default interface GoogleJwtPayload {
	email: string;
	email_verified: string;
	exp: string;
	family_name: string;
	given_name: string;
	iat: string;
	iss: string;
	name: string;
	picture: string;
	slug?:string
	sub: string;
	typ: string;
	aud: string;
	azp: string;
	jti: string;
	kid: string;
	nbf: string;
}

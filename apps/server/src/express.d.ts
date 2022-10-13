declare namespace Express {
	export interface Request {
		twitch?: Twitch // TODO: better typing
		user?: import("./mongoDb").UserDocument
		globals?: import("./mongoDb").GlobalsDocument
	}
}

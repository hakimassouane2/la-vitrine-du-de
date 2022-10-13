import type { RequestHandler } from "express"

import { userModel } from "../mongoDb"

const adminRequired: RequestHandler = (req, res, next) => {
	if (req.twitch && req.twitch.user_id) {
		return userModel
			.findOne({ isAdmin: true, twitchId: req.twitch.user_id.toString() })
			.then(user => {
				if (!user) {
					return res.status(404).send("Cet utilisateur n'existe pas.")
				}

				req.user = user
				return next()
			})
			.catch(error => {
				console.error(error)
				return res.status(500).send("Une chose inexplicable s'est produite...")
			})
	}

	return res
		.status(401)
		.send("Vous n'êtes pas authentifié par Twitch pour cette extension.")
}

const userRequired: RequestHandler = (req, res, next) => {
	if (req.twitch && req.twitch.user_id) {
		return userModel
			.findOne({ twitchId: req.twitch.user_id.toString() })
			.then(user => {
				if (!user) {
					return res.status(404).send("Cet utilisateur n'existe pas.")
				}

				req.user = user
				return next()
			})
			.catch(error => {
				console.error(error)
				return res.status(500).send("Une chose inexplicable s'est produite...")
			})
	}

	return res
		.status(401)
		.send("Vous n'êtes pas authentifié par Twitch pour cette extension.")
}

export { adminRequired, userRequired }

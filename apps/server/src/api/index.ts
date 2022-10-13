import cors from "cors"
import express from "express"
import type { Request } from "express"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bodyParser from "body-parser"

import { global } from "../global"
import { userModel } from "../mongoDb"
import { itemRouter } from "./itemRoutes"
import { userRouter } from "./userRouter"

const api = express()

// middlewares

api.use(bodyParser.json({ type: 'application/*+json' }))
api.use(cors())
api.use(express.json())
api.use(express.urlencoded())

const twitchRewardIdPointsMap = {
	"ae1c0014-ee43-47a1-a9da-321267019e3d" : 1,
	"19ebd56b-df27-4d29-811d-20fa0d686ce7": 10,
	"256e43e8-31dd-40b8-b980-1d7acbedcfd6": 100,
	"950e3ae8-a8e4-4209-ae66-628d16022f91": 1000
}

function verifyMessageIsFromTwitch(req: Request) {
	const message =
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		(req.headers["twitch-eventsub-message-id"] as string) +
		req.headers["twitch-eventsub-message-timestamp"] +
		JSON.stringify(req.body)

	const hmac =
		"sha256=" +
		crypto
			.createHmac("sha256", global.twitchSubSecret)
			.update(message)
			.digest("hex")

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return hmac === req.headers["twitch-eventsub-message-signature"]
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
api.post("/webhooks/channel-follow", async (req, res) => {
	if (!verifyMessageIsFromTwitch(req)) {
		console.info("Could not verify Twitch signature")
		return res.status(403).send()
	}

	if (
		req.headers &&
		req.headers["twitch-eventsub-message-type"] ==
			"webhook_callback_verification"
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (req.body.challenge) {
			console.info("Sending challenge key to twitch for channel-follow event")
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return res.status(200).send(req.body.challenge)
		}
	} else {
		console.info("Twitch channel-follow event received")
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		const user = await userModel.findOne({ twitchId: req.body.event.user_id })

		if (user) {
			user
				.updateOne({
					isFollowing: true,
					$inc: { points: user.isFollowing ? 0 : 300 }
				})
				.then(_ => res.status(200).send())
				.catch(error => {
					console.error(error)
					return res.status(500).send(`Impossible de modifier l'utilisateur`)
				})
		}
	}

	return res.status(200).send()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
api.post("/webhooks/sub-start", async (req, res) => {
	if (!verifyMessageIsFromTwitch(req)) {
		console.info("Could not verify Twitch signature")
		return res.status(403).send()
	}

	if (
		req.headers &&
		req.headers["twitch-eventsub-message-type"] ==
			"webhook_callback_verification"
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (req.body.challenge) {
			console.info("Sending challenge key to twitch for sub-start event")
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return res.status(200).send(req.body.challenge)
		}
	} else {
		console.info("Twitch sub-start event received")
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		const user = await userModel.findOne({ twitchId: req.body.event.user_id })

		let newMaxInventorySize = 7
		let newSubTier = 0

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		switch (req.body.event.tier) {
			case "1000":
				newMaxInventorySize = 10
				newSubTier = 1
				break
			case "2000":
				newMaxInventorySize = 20
				newSubTier = 2
				break
			case "3000":
				newMaxInventorySize = 30
				newSubTier = 3
				break
			default:
				newMaxInventorySize = 7
				newSubTier = 0
		}

		if (user) {
			user
				.updateOne({
					maxInventorySize: newMaxInventorySize,
					subTier: newSubTier,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
					$inc: { points: parseInt(req.body.event.tier) / 2 }
				})
				.then(_ => res.status(200).send())
				.catch(error => {
					console.error(error)
					return res.status(500).send(`Impossible de modifier l'utilisateur`)
				})
		}
	}

	return res.status(200).send()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
api.post("/webhooks/sub-renew", async (req, res) => {
	if (!verifyMessageIsFromTwitch(req)) {
		console.info("Could not verify Twitch signature")
		return res.status(403).send()
	}

	if (
		req.headers &&
		req.headers["twitch-eventsub-message-type"] ==
			"webhook_callback_verification"
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (req.body.challenge) {
			console.info("Sending challenge key to twitch for sub-renew event")
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return res.status(200).send(req.body.challenge)
		}
	} else {
		console.info("Twitch sub-renew event received")
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		const user = await userModel.findOne({ twitchId: req.body.event.user_id })
		let newMaxInventorySize = 7
		let newSubTier = 0

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		switch (req.body.event.tier) {
			case "1000":
				newMaxInventorySize = 10
				newSubTier = 1
				break
			case "2000":
				newMaxInventorySize = 20
				newSubTier = 2
				break
			case "3000":
				newMaxInventorySize = 30
				newSubTier = 3
				break
			default:
				newMaxInventorySize = 7
				newSubTier = 0
		}

		if (user) {
			user
				.updateOne({
					maxInventorySize: newMaxInventorySize,
					subTier: newSubTier,
					$inc: {
						points:
							// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
							(parseInt(req.body.event.tier) / 2) *
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
								req.body.event.duration_months +
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							req.body.event.cumulative_months * req.body.event.streak_months
					}
				})
				.then(_ => res.status(200).send())
				.catch(error => {
					console.error(error)
					return res.status(500).send(`Impossible de modifier l'utilisateur`)
				})
		}
	}

	return res.status(200).send()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
api.post("/webhooks/sub-end", async (req, res) => {
	if (!verifyMessageIsFromTwitch(req)) {
		console.info("Could not verify Twitch signature")
		return res.status(403).send()
	}

	if (
		req.headers &&
		req.headers["twitch-eventsub-message-type"] ==
			"webhook_callback_verification"
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (req.body.challenge) {
			console.info("Sending challenge key to twitch for sub-end event")
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return res.status(200).send(req.body.challenge)
		}
	} else {
		console.info("Twitch sub-end event received")
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		const user = await userModel.findOne({ twitchId: req.body.event.user_id })

		if (user) {
			// TODO set a global for the minimum inventory size
			user
				.updateOne({ maxInventorySize: 7, subTier: 0 })
				.then(_ => res.status(200).send())
				.catch(error => {
					console.error(error)
					return res.status(500).send(`Impossible de modifier l'utilisateur`)
				})
		}
		return res.status(200).send()
	}

	return res.status(500).send()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
api.post("/webhooks/sub-gift", async (req, res) => {
	if (!verifyMessageIsFromTwitch(req)) {
		console.info("Could not verify Twitch signature")
		return res.status(403).send()
	}

	if (
		req.headers &&
		req.headers["twitch-eventsub-message-type"] ==
			"webhook_callback_verification"
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (req.body.challenge) {
			console.info("Sending challenge key to twitch for sub-gift event")
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return res.status(200).send(req.body.challenge)
		}
	} else {
		console.info("Twitch sub-gift event received")

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (!req.body.event.is_anonymous) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const user = await userModel.findOne({ twitchId: req.body.event.user_id })

			if (user) {
				user
					.updateOne({
						$inc: {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
							points:
								// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-plus-operands
								(parseInt(req.body.event.tier) * req.body.event.total) / 2 +
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
								req.body.event.cumulative_total
						}
					})
					.then(_ => res.status(200).send())
					.catch(error => {
						console.error(error)
						return res.status(500).send(`Impossible de modifier l'utilisateur`)
					})
			}
		}
		return res.status(200).send()
	}

	return res.status(500).send()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
api.post("/webhooks/cheer", async (req, res) => {
	if (!verifyMessageIsFromTwitch(req)) {
		console.info("Could not verify Twitch signature")
		return res.status(403).send()
	}

	if (
		req.headers &&
		req.headers["twitch-eventsub-message-type"] ==
			"webhook_callback_verification"
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (req.body.challenge) {
			console.info("Sending challenge key to twitch for cheer event")
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return res.status(200).send(req.body.challenge)
		}
	} else {
		console.info("Twitch cheer event received")
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (!req.body.event.is_anonymous) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const user = await userModel.findOne({ twitchId: req.body.event.user_id })

			if (user) {
				user
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					.updateOne({ $inc: { points: req.body.event.bits * 1.9 } })
					.then(_ => res.status(200).send())
					.catch(error => {
						console.error(error)
						return res.status(500).send(`Impossible de modifier l'utilisateur`)
					})
			}
		}
		return res.status(200).send()
	}

	return res.status(500).send()
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
api.post("/webhooks/reward-redemption", async (req, res) => {
	if (!verifyMessageIsFromTwitch(req)) {
		console.info("Could not verify Twitch signature")
		return res.status(403).send()
	}

	if (
		req.headers &&
		req.headers["twitch-eventsub-message-type"] ==
			"webhook_callback_verification"
	) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (req.body.challenge) {
			console.info("Sending challenge key to twitch for reward redemption event")
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			return res.status(200).send(req.body.challenge)
		}
	} else {
		console.info("Twitch reward redemption event received")
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (twitchRewardIdPointsMap.hasOwnProperty(req.body.event.reward.id)) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const user = await userModel.findOne({ twitchId: req.body.event.user_id })

			if (user) {
				user
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					.updateOne({ $inc: { points: req.body.event.reward.cost / 10 } })
					.then(_ => res.status(200).send())
					.catch(error => {
						console.error(error)
						return res.status(500).send(`Impossible de modifier l'utilisateur`)
					})
			}
		}
		return res.status(200).send()
	}

	return res.status(500).send()
})

// middleware for twitch jwt
api.use((req, res, next) => {
	if (req.headers.authorization) {
		const [type, auth] = req.headers.authorization.split(" ")

		if (type === "Bearer") {
			return jwt.verify(
				auth,
				Buffer.from(process.env.TWITCH_EXTENSION_SECRET_KEY, "base64"),
				(error, decoded) => {
					if (error) {
						console.error("JWT error:", error)
						return res.status(401).send("Le JWT est invalide.")
					}

					req.twitch = decoded as Twitch

					return next()
				}
			)
		}

		return res.status(401).send("Votre en-tête d'authorisation est invalide.")
	}

	return res.status(401).send("Acun en-tête d'authorisation trouvé.")
})

// routes

api.use("/item", itemRouter)

api.use("/user", userRouter)

export { api }

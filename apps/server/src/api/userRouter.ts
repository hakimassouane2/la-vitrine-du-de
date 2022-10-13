import { Router } from "express"
import type { Request } from "express-serve-static-core" // TODO: why not simply "express"?
import got from "got"

import type { BaseInventoryData } from "@la-vitrine-du-de/db-typings"

import { adminRequired } from "./middlewares"

import { global } from "../global"
import { userModel } from "../mongoDb"

const userRouter = Router()

// Check if user exists, if not create them
/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
userRouter.post("/:twitchId", async (req, res) => {
	try {
		const user = await userModel.findOne({ twitchId: req.params.twitchId })

		if (!user && req.twitch) {
			const resp = await got.get(
				`https://api.twitch.tv/helix/users?id=${req.twitch.user_id}`,
				{
					headers: {
						"client-id": process.env.TWITCH_EXTENSION_CLIENT_ID,
						authorization: `Bearer ${global.appAccessToken}`
					},
					responseType: "json"
				}
			)
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const twitchUser = (resp as any).body.data?.[0] as
				| { id: number; display_name: string }
				| undefined // TODO: better typing

			if (!twitchUser) {
				return res
					.status(404)
					.send("L'API Twitch n'a pas trouvé votre utilisateur.")
			}

			const isFollower = await got.get(
				`https://api.twitch.tv/helix/users/follows?from_id=${req.twitch.user_id}&to_id=${process.env.TWITCH_CHANNEL_ID}`,
				{
					headers: {
						"client-id": process.env.TWITCH_EXTENSION_CLIENT_ID,
						authorization: `Bearer ${global.appAccessToken}`
					},
					responseType: "json"
				}
			) as any

			const isSub = await got.get(
				`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${process.env.TWITCH_CHANNEL_ID}&user_id=${req.twitch.user_id}`,
				{
					headers: {
						"client-id": process.env.TWITCH_EXTENSION_CLIENT_ID,
						authorization: `Bearer ${global.appAccessToken}`
					},
					responseType: "json"
				}
			) as any

			await userModel.create({
				twitchId: twitchUser.id,
				name: twitchUser.display_name,
				isFollowing: isFollower.body.total > 0,
				...(isSub.body.data[0] && {
					subtier: isSub.body.data[0].tier / 1000
				}),
			})
		}

		res.status(200).send()
	} catch (error) {
		console.error(error)
		return res
			.status(500)
			.send("Une erreur est survenue durant le contact avec l'API Twitch.")
	}

	return res.status(500).send()
})

// Get all users
userRouter.get("/", adminRequired, (_req, res) => {
	return userModel
		.find()
		.then(users => {
			return res.json(users)
		})
		.catch(error => {
			console.error(error)
			return res.status(500).send("Impossible de récupérer les utilisateurs...")
		})
})

// Get one user
userRouter.get("/:id", adminRequired, (req: Request<{ id: string }>, res) => {
	return userModel
		.findById(req.params.id)
		.then(user => {
			if (!user) {
				return res
					.status(404)
					.send(`L'utilisateur #${req.params.id} n'existe pas.`)
			}

			return res.json(user)
		})
		.catch(error => {
			console.error(error)
			return res
				.status(500)
				.send(`Impossible de récupérer l'utilisateur #${req.params.id}...`)
		})
})

userRouter.post(
	"/:id/points",
	adminRequired,
	(req: Request<{ id: string }, unknown, { points: number }>, res) => {
		if (!req.body.points) {
			return res.status(400).send("Tu n'as pas précisé un montant de points !")
		}

		return userModel
			.findById(req.params.id)
			.then(user => {
				if (!user) {
					return res
						.status(404)
						.send(`L'utilisateur #${req.params.id} n'existe pas.`)
				}

				return user
					.updateOne({ points: req.body.points })
					.then(_ => res.status(200).send())
					.catch(error => {
						console.error(error)
						return (
							res
								.status(500)
								// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
								.send(`Impossible de modifier l'utilisateur #${user._id}...`)
						)
					})
			})
			.catch(error => {
				console.error(error)
				return res
					.status(500)
					.send(`Impossible de récupérer l'utilisateur #${req.params.id}...`)
			})
	}
)

userRouter.post(
	"/:id/points/add",
	adminRequired,
	(req: Request<{ id: string }, unknown, { points: number }>, res) => {
		if (!req.body.points) {
			return res.status(400).send("Tu n'as pas précisé un montant de points !")
		}

		return userModel
			.findById(req.params.id)
			.then(user => {
				if (!user) {
					return res
						.status(404)
						.send(`L'utilisateur #${req.params.id} n'existe pas.`)
				}

				return user
					.updateOne({ $inc: { points: req.body.points } })
					.then(_ => res.status(200).send())
					.catch(error => {
						console.error(error)
						return (
							res
								.status(500)
								// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
								.send(`Impossible de modifier l'utilisateur #${user._id}...`)
						)
					})
			})
			.catch(error => {
				console.error(error)
				return res
					.status(500)
					.send(`Impossible de récupérer l'utilisateur #${req.params.id}...`)
			})
	}
)

userRouter.post(
	"/:id/points/remove",
	adminRequired,
	(req: Request<{ id: string }, unknown, { points: number }>, res) => {
		if (!req.body.points) {
			return res.status(400).send("Tu n'as pas précisé un montant de points !")
		}

		return userModel
			.findById(req.params.id)
			.then(user => {
				if (!user) {
					return res
						.status(404)
						.send(`L'utilisateur #${req.params.id} n'existe pas.`)
				}

				return user
					.updateOne({ $inc: { points: -req.body.points } })
					.then(_ => res.status(200).send())
					.catch(error => {
						console.error(error)
						return (
							res
								.status(500)
								// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
								.send(`Impossible de modifier l'utilisateur #${user._id}...`)
						)
					})
			})
			.catch(error => {
				console.error(error)
				return res
					.status(500)
					.send(`Impossible de récupérer l'utilisateur #${req.params.id}...`)
			})
	}
)

userRouter.post(
	"/:id/inventory",
	adminRequired,
	(
		req: Request<
			{ id: string },
			unknown,
			{ inventory: { [key: string]: BaseInventoryData } }
		>,
		res
	) => {
		if (!req.body.inventory) {
			return res.status(400).send("Tu n'as pas précisé d'inventaire !")
		}

		return userModel
			.findById(req.params.id)
			.then(user => {
				if (!user) {
					return res
						.status(404)
						.send(`L'utilisateur #${req.params.id} n'existe pas.`)
				}

				return user
					.updateOne({ inventory: new Map(Object.entries(req.body.inventory)) })
					.then(_ => res.status(200).send())
					.catch(error => {
						console.error(error)
						return (
							res
								.status(500)
								// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
								.send(`Impossible de modifier l'utilisateur #${user._id}...`)
						)
					})
			})
			.catch(error => {
				console.error(error)
				return res
					.status(500)
					.send(`Impossible de récupérer l'utilisateur #${req.params.id}...`)
			})
	}
)

export { userRouter }

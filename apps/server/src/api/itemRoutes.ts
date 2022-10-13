import { Router } from "express"

import type { Request } from "express-serve-static-core" // TODO: why not simply "express"?

import { weightedRandom } from "~/utils/random"

import { adminRequired, userRequired } from "./middlewares"
import { globalsModel, itemModel, userModel } from "../mongoDb"
import { global } from "../global"

const itemRouter = Router()

itemRouter.get("/:id/buy", userRequired, async (req, res) =>
	itemModel
		.findById(req.params.id)
		.then(item => {
			if (!item) {
				return res.status(404).send(`La carte #${req.params.id} n'existe pas.`)
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (req.user!.points < item.price) {
				// TODO: req.user should be defined
				return res
					.status(403)
					.send(`T'as pas assez de points pour acheter la carte "${item.name}"`)
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const inventory = req.user!.inventory
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const inventoryData = inventory.get(item._id)

			let nbrObjectInInventory = 0

			for (const { stock } of inventory.values()) {
				nbrObjectInInventory += stock
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (nbrObjectInInventory >= req.user!.maxInventorySize) {
				return res
					.status(403)
					.send(`Tu n'as pas assez de place dans ton inventaire 🎒`)
			}

			if (inventoryData) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				inventory.set(item._id, {
					stock: inventoryData.stock + 1,
					lastUsed: inventoryData.lastUsed
				})
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				inventory.set(item._id, { stock: 1 })
			}

			return userModel
				.findByIdAndUpdate(
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-assignment
					{ _id: req.user!._id },
					{ $inc: { points: -item.price }, inventory },
					{ new: true }
				)
				.then(_updatedUser => {
					return res.status(200).send()
				})
				.catch(error => {
					console.error(error)
					return (
						res
							.status(500)
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/restrict-template-expressions
							.send(`Impossible de modifier l'utilisateur #${req.user!._id}...`)
					)
				})
		})
		.catch(error => {
			console.error(error)
			return res
				.status(500)
				.send(`Impossible de récupérer la carte #${req.params.id}...`)
		})
)

itemRouter.get("/:id/sell", userRequired, (req, res) =>
	itemModel
		.findById(req.params.id)
		.then(item => {
			if (!item) {
				return res.status(404).send(`La carte #${req.params.id} n'existe pas.`)
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const inventory = req.user!.inventory
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const inventoryData = inventory.get(item._id)

			if (!inventoryData || inventoryData.stock <= 0) {
				return res
					.status(404)
					.send(`Tu ne possèdes pas la carte "${item.name}".`)
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			inventory.set(item._id, {
				stock: inventoryData.stock - 1,
				lastUsed: inventoryData.lastUsed
			})

			return userModel
				.findByIdAndUpdate(
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-assignment
					{ _id: req.user!._id },
					{ $inc: { points: Math.floor(item.price / 2) }, inventory },
					{ new: true }
				)
				.then(_updatedUser => {
					return res.status(200).send()
				})
				.catch(error => {
					console.error(error)
					return (
						res
							.status(500)
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/restrict-template-expressions
							.send(`Impossible de modifier l'utilisateur #${req.user!._id}...`)
					)
				})
		})
		.catch(error => {
			console.error(error)
			return res
				.status(500)
				.send(`Impossible de récupérer la carte #${req.params.id}...`)
		})
)

itemRouter.post("/:id/use", userRequired, (req: Request<
	{ id: string },
	unknown,
	{ target: string }
>, res) =>
	itemModel
		.findById(req.params.id)
		.then(async item => {
			if (!item) {
				return res.status(404).send(`La carte #${req.params.id} n'existe pas.`)
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			} else if (item.rarity > 0 && req.user!.isFollowing === false) {
				return res
					.status(403)
					.send(`Tu dois suivre la chaîne pour pouvoir utiliser cette carte 🎁`)
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const inventory = req.user!.inventory
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const inventoryData = inventory.get(item._id)

			if (!inventoryData || inventoryData.stock <= 0) {
				return res
					.status(400)
					.send(`Tu ne possèdes pas la carte "${item.name}".`)
			}

			const now = new Date()

			let elapsed = 0

			if (inventoryData.lastUsed) {
				if (typeof inventoryData.lastUsed === "string") {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/restrict-template-expressions
					console.info(`This is not normal... Please check user ${req.user!.name} (${req.user!._id})'s inventory:`, inventory)
					elapsed = now.getTime() - new Date(inventoryData.lastUsed).getTime()
				} else {
					elapsed = now.getTime() - inventoryData.lastUsed.getTime()
				}
			}

			if (
				elapsed &&
				(elapsed < item.userCooldown ||
					elapsed < item.globalCooldown ||
					elapsed < parseInt(process.env.GLOBAL_COOLDOWN))
			) {
				return res
					.status(400)
					.send(`Tu ne peux pas encore utiliser l'item "${item.name}".`)
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			inventory.set(item._id, {
				stock: inventoryData.stock - 1,
				lastUsed: now
			})

			await globalsModel.updateMany({}, { lastUsed: now }).exec() // double dirty: updateMany for one entry and need to do it at the same time as the next transaction

			return item
				.update({ lastUsed: now })
				.then(() => {
					userModel
						.findByIdAndUpdate(
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-assignment
							{ _id: req.user!._id },
							{ inventory },
							{ new: true }
						)
						.then(async updatedUser => {
							if (updatedUser) {
								let rollResult = ''

								await global.chatClient.say("lavolontedude", `${updatedUser?.name} vient d'utiliser la carte ${item.name} ${req.body.target ? `sur ${req.body.target}` : ""}.`)

								if (item.isRollable) {
									await item.populate('rollTable')

									rollResult = weightedRandom(item.rollTable.elements, item.rollTable.weigths) || ''
									await global.chatClient.say("lavolontedude", `${rollResult} a été selectionné !`)
								}
							}

							return res.status(200).send()
						})
						.catch(error => {
							console.error(error)
							return res.status(500).send(
								// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/restrict-template-expressions
								`Impossible de modifier l'utilisateur #${req.user!._id}...`
							)
						})
				})
				.catch(error => {
					console.error(error)
					return (
						res
							.status(500)
							// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
							.send(`Impossible de modifier la carte #${item._id}...`)
					)
				})
		})
		.catch(error => {
			console.error(error)
			return res
				.status(500)
				.send(`Impossible de récupérer la carte #${req.params.id}...`)
		})
)

itemRouter.post("/:id/update", adminRequired, (req, res) =>
	itemModel
		.findById(req.params.id)
		.then(item => {
			if (!item) {
				return res.status(404).send(`La carte #${req.params.id} n'existe pas.`)
			}

			return item
				.update({})
				.then(() => {
					return res
						.status(202)
						.send(`La carte "${item.name}" a été mis à jour 🔁`)
				})
				.catch(error => {
					console.error(error)
					return (
						res
							.status(500)
							// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
							.send(`Impossible de modifier la carte #${item._id}...`)
					)
				})
		})
		.catch(error => {
			console.error(error)
			return res
				.status(500)
				.send(`Impossible de récupérer la carte #${req.params.id}...`)
		})
)

export { itemRouter }

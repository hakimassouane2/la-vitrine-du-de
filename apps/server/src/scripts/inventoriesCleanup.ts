import { connectDb, userModel } from "../mongoDb"

console.info("Connecting to MongoDB...")

connectDb()
	.then(async () => {
		console.info("MongoDB connected!")

		try {
			const users = await userModel.find()
			const updates = []

			for (const user of users) {
				const inventory = user.inventory
				let hasChanged = false

				for (const [itemId, inventoryData] of inventory) {
					if (inventoryData.stock === 0) {
						inventory.delete(itemId)
						hasChanged = true
					}
				}

				if (hasChanged) {
					updates.push(user.update({ inventory }))
				}
			}

			await Promise.all(updates)

			console.info("User's inventory cleaned up!")
		} catch (error) {
			console.error("Error during inventory cleanup: ", error)
		}
	})
	.catch(error => console.error("Error during db connection: ", error))

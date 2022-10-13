import { connectDb, disconnectDb, userModel } from "../mongoDb"
import axios from 'axios';

const TIER0_POINTS = 20
const TIER1_POINTS = 25
const TIER2_POINTS = 32
const TIER3_POINTS = 40

function getUserPromise(viewers: string[], subTier: 0 | 1 | 2 | 3) {
	let pointsInc = 0

	switch (subTier) {
	case 0:
		pointsInc = TIER0_POINTS
		break

	case 1:
		pointsInc = TIER1_POINTS
		break

	case 2:
		pointsInc = TIER2_POINTS
		break

	case 3:
		pointsInc = TIER3_POINTS
	}

	return userModel
		.updateMany({ name: { $in: viewers }, subTier }, { $inc: { points: pointsInc } }, { collation: {locale: "en_US", strength: 1 } })
		.then(({ modifiedCount }) => {
			console.info(`${pointsInc} points added to ${modifiedCount} users (subTier ${subTier})!`)
		})
}

console.info("Connecting to MongoDB...")

connectDb()
	.then(() => {
		console.info("MongoDB connected!")
		axios.get('https://tmi.twitch.tv/group/user/lavolontedude/chatters')
		.then(function (response: any) {
			const chatters = response.data.chatters
			const listOfViewers = [...chatters.broadcaster, ...chatters.vips, ...chatters.moderators, ...chatters.viewers]

			Promise.all([
				getUserPromise(listOfViewers, 0),
				getUserPromise(listOfViewers, 1),
				getUserPromise(listOfViewers, 2),
				getUserPromise(listOfViewers, 3)
			])
				.then(() => console.log("All updates done!"))
				.catch(error => console.error("Error during update: ", error))
				.finally(() => {
					disconnectDb()
						.then(() => console.log('Database disconnected, now exiting script...')		)
				})
		})
		.catch(function (error: any) {
			console.log(error)
		})
	})
	.catch(error => console.error("Error during db connection: ", error))

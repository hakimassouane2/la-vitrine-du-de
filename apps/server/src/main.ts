import got from "got"
import jwt from "jsonwebtoken"
import crypto from "crypto"

import { api } from "./api"
import { global } from "./global"
import { connectDb } from "./mongoDb"
import { connectWebsockets } from "./websockets"

console.info("Connecting to MongoDB...")

const webhooksArray = {
	"channel.follow": "channel-follow",
	"channel.subscribe": "sub-start",
	"channel.subscription.message": "sub-renew",
	"channel.subscription.end": "sub-end",
	"channel.subscription.gift": "sub-gift",
	"channel.cheer": "cheer",
	"channel.channel_points_custom_reward_redemption.add": "reward-redemption"
}

async function callSubscriptionRoute(
	twitchSubType: string,
	webhookUrl: string
) {
	return got
		.post("https://api.twitch.tv/helix/eventsub/subscriptions", {
			headers: {
				"Content-Type": "application/json",
				"client-id": process.env.TWITCH_EXTENSION_CLIENT_ID,
				authorization: `Bearer ${global.appAccessToken}`
			},
			json: {
				type: twitchSubType,
				version: "1",
				condition: { broadcaster_user_id: process.env.TWITCH_CHANNEL_ID },
				transport: {
					method: "webhook",
					callback: `https://lavitrinedude.click/webhooks/${webhookUrl}`,
					secret: `${global.twitchSubSecret}`
				}
			}
		})
		.then(() => {
			console.info(`Posted subscribtion for ${twitchSubType} event`)
		})
		.catch(err => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			console.error("error is => ", err.body, err.message, err)
		})
}

async function callDeleteSubscriptionRoute(
	twitchSubscriptionType: string,
	twitchSubscriptionId: string
) {
	return got
		.delete(
			`https://api.twitch.tv/helix/eventsub/subscriptions?id=${twitchSubscriptionId}`,
			{
				headers: {
					"client-id": process.env.TWITCH_EXTENSION_CLIENT_ID,
					authorization: `Bearer ${global.appAccessToken}`
				}
			}
		)
		.then(() => {
			console.info(`Deleted "${twitchSubscriptionType}" from twitch`)
		})
		.catch(err => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			console.error("error is => ", err.body, err.message, err)
		})
}

connectDb()
	.then(() => {
		console.info("MongoDB connected!")

		console.info("Fetching Twitch access token...")

		got
			.post("https://id.twitch.tv/oauth2/token", {
				form: {
					client_id: process.env.TWITCH_EXTENSION_CLIENT_ID,
					client_secret: process.env.TWITCH_EXTENSION_CLIENT_SECRET,
					grant_type: "client_credentials",
					scope:
						"chat:edit chat:read bits:read analytics:read:games channel:read:subscriptions user:read:subscriptions channel:read:polls channel:manage:polls channel:read:redemptions channel:manage:redemptions"
				},
				responseType: "json"
			})
			.then((resp: any) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				const appAccessToken = resp.body.access_token as string | undefined

				if (appAccessToken) {
					global.appAccessToken = appAccessToken
					global.jwtToken = jwt.sign(
						{
							channel_id: process.env.TWITCH_CHANNEL_ID,
							exp: new Date().getTime() / 1000 + 86400,
							role: "external",
							user_id: process.env.TWITCH_CHANNEL_ID
						},
						Buffer.from(process.env.TWITCH_EXTENSION_SECRET_KEY, "base64")
					)

					console.info("Twitch access token fetched:", global.appAccessToken)
					console.info("JWT token signed:", global.jwtToken)

					// Checking Twitch subscribe list and deleting them if they exist to make sure we get a fresh start
					got
						.get("https://api.twitch.tv/helix/eventsub/subscriptions", {
							headers: {
								"client-id": process.env.TWITCH_EXTENSION_CLIENT_ID,
								authorization: `Bearer ${global.appAccessToken}`
							},
							responseType: "json"
						})
						.then(async (resp: any) => {
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							const totalCurrentSubscription = resp.body.total as
								| number
								| undefined // TODO: better typing

							if (totalCurrentSubscription && totalCurrentSubscription > 0) {
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
								const dataToParse = resp.body.data as
									| Array<{ id: string; type: string }>
									| undefined // TODO: better typing

								if (dataToParse) {
									const deletePromises = []

									for (const { id, type } of dataToParse) {
										deletePromises.push(callDeleteSubscriptionRoute(type, id))
									}

									await Promise.all(deletePromises)
									console.info("Deleted all previous subscriptions")
								}
							}

							console.info("Starting subscription to Twitch events")

							global.twitchSubSecret = crypto.randomBytes(12).toString("hex")
							console.info(
								"Twitch sub generated secret:",
								global.twitchSubSecret
							)

							const promises = []
							for (const [twitchSubType, webhookUrl] of Object.entries(
								webhooksArray
							)) {
								promises.push(callSubscriptionRoute(twitchSubType, webhookUrl))
							}

							await Promise.all(promises)

							console.info("Finished subscription to Twitch events")

							console.info("Ready to start...")
							const expressServer = api.listen(process.env.PORT, () =>
								console.info(
									`Server started! Listening on ${process.env.PORT}...`
								)
							)

							console.info("Server started, now connecting websockets...")
							connectWebsockets(expressServer)
							console.info("Websockets are on.")

							console.info("EVERYTHING'S ON!")
						})
						.catch(err => {
							console.error(
								"Error at getting subscription list: ",
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
								err.statusCode,
								// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
								err.body
							)
						})
				} else {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					console.error("No access_token found in body: ", resp.body)
				}
			})
			.catch(err => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				console.error("Error at token generation: ", err, err.statusCode, err.body)
			})
	})
	.catch(err => console.error("Error during db connection: ", err))

export {}

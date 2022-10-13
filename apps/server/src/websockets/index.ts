import type { Server } from "http"
import jwt from "jsonwebtoken"
import type { Socket } from "net"
import { WebSocketServer } from "ws"
import type { WebSocket } from "ws"

import {
	CharacterDocument,
	characterModel,
	globalsModel,
	itemModel,
	userModel
} from "../mongoDb"
import type { GlobalsDocument, ItemDocument, UserDocument } from "../mongoDb"

function connectWebsockets(expressServer: Server) {
	const globalsWebsocket = new WebSocketServer({ noServer: true })
	const globalsConnections = new Map<string, WebSocket>()
	const itemWebsocket = new WebSocketServer({ noServer: true })
	const itemConnections = new Map<string, WebSocket>()
	const characterWebsocket = new WebSocketServer({ noServer: true })
	const characterConnections = new Map<string, WebSocket>()
	const userWebsocket = new WebSocketServer({ noServer: true })
	const userConnections = new Map<string, WebSocket>()
	const adminWebsocket = new WebSocketServer({ noServer: true })
	const adminConnections = new Map<string, WebSocket>()

	expressServer.on("upgrade", (req, socket, head) => {
		const regexec =
			/^\/(?<path>.*)\?.*twitchId=(?<twitchId>\d*).*twitchJwt=(?<twitchJwt>.*)$/.exec(
				req.url || ""
			)

		if (!regexec || !regexec.groups) {
			return socket.destroy()
		}

		jwt.verify(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			regexec.groups.twitchJwt,
			Buffer.from(process.env.TWITCH_EXTENSION_SECRET_KEY, "base64"),
			(error, decoded) => {
				if (error || !decoded) {
					console.error("JWT error:", error)
					return socket.destroy()
				}

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				if (decoded.user_id !== regexec.groups!.twitchId) {
					console.error("JWT doesn't match")
					return socket.destroy()
				}
			}
		)

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		switch (regexec.groups.path) {
			case "globals":
				globalsWebsocket.handleUpgrade(req, socket as Socket, head, client => {
					globalsWebsocket.emit("connection", client, req)
				})
				break

			case "item":
				itemWebsocket.handleUpgrade(req, socket as Socket, head, client => {
					itemWebsocket.emit("connection", client, req)
				})
				break

			case "user":
				userWebsocket.handleUpgrade(req, socket as Socket, head, client => {
					userWebsocket.emit("connection", client, req)
				})
				break

			case "character":
				characterWebsocket.handleUpgrade(
					req,
					socket as Socket,
					head,
					client => {
						characterWebsocket.emit("connection", client, req)
					}
				)
				break

			case "admin":
				userModel.findOne({ twitchId: regexec.groups.twitchId })
					.then(user => {
						if (!user?.isAdmin) {
							return socket.destroy()
						}

						adminWebsocket.handleUpgrade(req, socket as Socket, head, client => {
							adminWebsocket.emit("connection", client, req)
						})
					})
					.catch((error) => {
						socket.destroy()
						console.error(error)
					})
				break

			default:
				socket.destroy()
		}
	})


	globalsWebsocket.on("connection", (socket, request) => {
		const regexec =
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			/^\/(?<path>.*)\?.*twitchId=(?<twitchId>\d*).*twitchJwt=(?<twitchJwt>.*)$/.exec(
				request.url || ""
			)!

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		globalsConnections.set(regexec.groups!.twitchId, socket)

		globalsModel
			.findOne()
			.then(globals => socket.send(JSON.stringify(globals)))
			.catch(error => console.error(error))
	})

	itemWebsocket.on("connection", (socket, request) => {
		const regexec =
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			/^\/(?<path>.*)\?.*twitchId=(?<twitchId>\d*).*twitchJwt=(?<twitchJwt>.*)$/.exec(
				request.url || ""
			)!

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		itemConnections.set(regexec.groups!.twitchId, socket)

		itemModel
			.find()
			.then(items => socket.send(JSON.stringify(items)))
			.catch(error => console.error(error))
	})

	userWebsocket.on("connection", (socket, request) => {
		const regexec =
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			/^\/(?<path>.*)\?.*twitchId=(?<twitchId>\d*).*twitchJwt=(?<twitchJwt>.*)$/.exec(
				request.url || ""
			)!

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		userConnections.set(regexec.groups!.twitchId, socket)

		userModel
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			.findOne({ twitchId: regexec.groups!.twitchId })
			.then(user => socket.send(JSON.stringify(user)))
			.catch(error => console.error(error))
	})

	characterWebsocket.on("connection", (socket, request) => {
		const regexec =
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			/^\/(?<path>.*)\?.*twitchId=(?<twitchId>\d*).*twitchJwt=(?<twitchJwt>.*)$/.exec(
				request.url || ""
			)!

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		characterConnections.set(regexec.groups!.twitchId, socket)

		characterModel
			.find()
			.then(characters => socket.send(JSON.stringify(characters)))
			.catch(error => console.error(error))
	})

	adminWebsocket.on("connection", (socket, request) => {
		const regexec =
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			/^\/(?<path>.*)\?.*twitchId=(?<twitchId>\d*).*twitchJwt=(?<twitchJwt>.*)$/.exec(
				request.url || ""
			)!

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		adminConnections.set(regexec.groups!.twitchId, socket)

		userModel
			.find()
			.then(users => socket.send(JSON.stringify(users)))
			.catch(error => console.error(error))
	})


	const globalsWatcher = globalsModel.watch(
		[{ $match: { operationType: "update" } }],
		{ fullDocument: "updateLookup" }
	)

	globalsWatcher.on("change", changeEvent => {
		let globals: GlobalsDocument

		switch (changeEvent.operationType) {
			case "update":
				globals = changeEvent.fullDocument as GlobalsDocument

				break

			default:
				// Shouldn't even go there with the $match clause in the pipeline
				console.error(
					`Operation type "${changeEvent.operationType}" not handled.`
				)

				return
		}

		globalsConnections.forEach(ws => ws.send(JSON.stringify(globals)))
	})

	const itemWatcher = itemModel.watch(
		[
			{
				$match: {
					$or: [{ operationType: "insert" }, { operationType: "update" }]
				}
			}
		],
		{ fullDocument: "updateLookup" }
	)

	itemWatcher.on("change", changeEvent => {
		let item: ItemDocument

		switch (changeEvent.operationType) {
			case "insert":
			case "update":
				item = changeEvent.fullDocument as ItemDocument

				break

			default:
				// Shouldn't even go there with the $match clause in the pipeline
				console.error(
					`Operation type "${changeEvent.operationType}" not handled.`
				)

				return
		}

		itemConnections.forEach(ws => ws.send(JSON.stringify([item])))
	})

	const userWatcher = userModel.watch(
		[{ $match: { operationType: { $in: ["insert", "update"] }}}],
		{ fullDocument: "updateLookup" }
	)

	userWatcher.on("change", changeEvent => {
		let user: UserDocument

		switch (changeEvent.operationType) {
			case "insert":
			case "update":
				user = changeEvent.fullDocument as UserDocument

				break

			default:
				// Shouldn't even go there with the $match clause in the pipeline
				console.error(
					`Operation type "${changeEvent.operationType}" not handled.`
				)

				return
		}

		for (const adminConnection of adminConnections.values()) {
			adminConnection.send(JSON.stringify([user]))
		}

		if (userConnections.get(user.twitchId)) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			userConnections.get(user.twitchId)!.send(JSON.stringify(user))
		} else {
			// console.log("user conenctions get failed, user connections is => ", userConnections)
			// console.log("user is => ", user)
		}
	})

	const characterWatcher = characterModel.watch(
		[
			{
				$match: {
					$or: [{ operationType: "insert" }, { operationType: "update" }]
				}
			}
		],
		{ fullDocument: "updateLookup" }
	)

	characterWatcher.on("change", changeEvent => {
		let character: CharacterDocument

		switch (changeEvent.operationType) {
			case "insert":
			case "update":
				character = changeEvent.fullDocument as CharacterDocument

				break

			default:
				// Shouldn't even go there with the $match clause in the pipeline
				console.error(
					`Operation type "${changeEvent.operationType}" not handled.`
				)

				return
		}

		characterConnections.forEach(ws => ws.send(JSON.stringify([character])))
	})

	return [globalsWebsocket, itemWebsocket, userWebsocket, characterWebsocket]
}

export { connectWebsockets }

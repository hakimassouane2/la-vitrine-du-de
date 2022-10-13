import { readable, writable } from "svelte/store"

import { setupWebsocket } from "~/services"

const charactersStore = writable<Map<string, Character>>( // The key is the character id
	new Map(),
	() => {
		const socket = setupWebsocket('character', event => {
			const characters = JSON.parse(event.data as string) as Character[]

			charactersStore.update(charactersMap => {
				for (const character of characters) {
					charactersMap.set(character._id, character)
				}

				return charactersMap
			})
		})

		return socket.close
	}
)

const globalsStore = readable<Globals | undefined>(
	undefined,
	set => {
		const socket = setupWebsocket('globals', event => set(JSON.parse(event.data)))

		return socket.close
	}
)

const itemsStore = writable<Map<string, Item>>( // The key is the item id
	new Map(),
	() => {
		const socket = setupWebsocket('item', event => {
			const items = JSON.parse(event.data as string) as Item[]

			itemsStore.update(itemsMap => {
				for (const item of items) {
					itemsMap.set(item._id, item)
				}

				return itemsMap
			})
		})

		return socket.close
	}
)

const userStore = readable<User | undefined>(
	undefined,
	set => {
		const socket = setupWebsocket('user', event => set(JSON.parse(event.data)))

		return socket.close
	}
)

const usersStore = writable<Map<string, User>>( // The key is the user id
	new Map(),
	() => {
		const socket = setupWebsocket('admin', event => {
			const users = JSON.parse(event.data as string) as User[]

			usersStore.update(usersMap => {
				for (const user of users) {
					usersMap.set(user._id, user)
				}

				return usersMap
			})
		})

		return socket.close
	}
)

const notificationStore = writable<ShopNotification[]>([])

export {
	charactersStore,
	globalsStore,
	itemsStore,
	userStore,
	usersStore,
	notificationStore
}

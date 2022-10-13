import { get, post } from "./fetch"

class UserFetch {
	readonly baseUrl = `${import.meta.env.VITE_API_URL}/user`

	check(twitchId: string) {
		return post<void>(`${this.baseUrl}/${twitchId}`)
	}

	getAll() {
		return get<User[]>(`${this.baseUrl}/`)
	}

	getOne(id: string) {
		return get<User>(`${this.baseUrl}/${id}`)
	}

	setPoints(id: string, points: number) {
		return post<void>(`${this.baseUrl}/${id}/points`, { points })
	}

	addPoints(id: string, points: number) {
		return post<void>(`${this.baseUrl}/${id}/points/add`, { points })
	}

	removePoints(id: string, points: number) {
		return post<void>(`${this.baseUrl}/${id}/points/remove`, { points })
	}

	setInventory(id: string, inventory: { [itemId: string]: InventoryData }) {
		return post<void>(`${this.baseUrl}/${id}/inventory`, { inventory })
	}
}

export const userFetch = new UserFetch()

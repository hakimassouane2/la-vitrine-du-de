type Item = import("@la-vitrine-du-de/db-typings").BaseItem & {
	_id: string
	lastUsed?: string
}

type InventoryData = import("@la-vitrine-du-de/db-typings").BaseInventoryData & {
	lastUsed?: string
}

type User = import("@la-vitrine-du-de/db-typings").BaseUser & {
	_id: string
	inventory: { [itemId: string]: InventoryData } // cannot fetch as Map
	lastSeen: string
}

type Character = import("@la-vitrine-du-de/db-typings").BaseCharacter & {
	_id: string
}

type Globals = import("@la-vitrine-du-de/db-typings").BaseGlobals & {
	lastUsed?: string
}

import { connect, disconnect } from "mongoose"

const connectDb = () => {
	return connect(process.env.MONGODB_URL)
}

const disconnectDb = () => {
	return disconnect()
}

export { connectDb, disconnectDb }
export * from "./globalsModel"
export * from "./itemModel"
export * from "./userModel"
export * from "./characterModel"

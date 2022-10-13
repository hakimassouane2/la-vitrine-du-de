import { Schema, model } from "mongoose"
import type { Document, Model } from "mongoose"

import type { BaseUser } from "@la-vitrine-du-de/db-typings"

interface UserDocument extends BaseUser, Document {}

type UserModel = Model<UserDocument>

const userSchema = new Schema<UserDocument, UserModel, BaseUser>(
	{
		twitchId: {
			type: String,
			unique: true,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		points: {
			type: Number,
			default: 0,
			min: 0
		},
		inventory: {
			type: Schema.Types.Map,
			default: new Map()
		},
		lastSeen: Date,
		isAdmin: {
			type: Boolean,
			required: true,
			default: false
		},
		subTier: {
			type: Number,
			default: 0,
			min: 0,
			max: 3
		},
		isFollowing: {
			type: Boolean,
			required: true,
			default: false
		},
		maxInventorySize: {
			type: Number,
			required: true,
			default: 7,
			min: 7
		},
		level: {
			type: Number,
			required: true,
			default: 1,
			min: 1
		},
		currentXp: {
			type: Number,
			required: true,
			default: 0,
			min: 0
		}
	},
	{ timestamps: true }
)

const userModel = model<UserDocument, UserModel>("user", userSchema)

export { userModel }

export type { UserDocument, UserModel }

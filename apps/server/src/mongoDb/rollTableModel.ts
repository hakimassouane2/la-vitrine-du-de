import { Schema,  model } from "mongoose"
import type { Document, Model } from "mongoose"

import type { BaseRollTable } from "@la-vitrine-du-de/db-typings"

interface RollTableDocument extends BaseRollTable, Document {}

type RollTableModel = Model<RollTableDocument>

const rollTableSchema = new Schema<RollTableDocument, RollTableModel, BaseRollTable>(
	{
		elements: [{type: String}],
		weigths: [{type: Number}],
	},
	{ timestamps: true }
)

const rollTableModel = model<RollTableDocument, RollTableModel>("rollTable", rollTableSchema)

export { rollTableModel }

export type { RollTableDocument, RollTableModel }

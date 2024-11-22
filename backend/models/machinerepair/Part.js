const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const machinePartSchema = new Schema({
	date: {
		type: Date,
		required: true,
		get: (date) => date.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
		set: (date) => new Date(date), // Ensure that the input is parsed as a Date object
	},

	description: {
		type: String,
	},

	amount: {
		type: Number,
	},
});
const Part = mongoose.model("Part", machinePartSchema);
module.exports = Part;
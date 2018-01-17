var mongoose = require("mongoose");

// save a reference to the Schema constructor
var Schema = mongoose.Schema

// using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
	// `title` is a String
	title: String,
	// `body` is a String
	body: String
});

// this creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// export the note model
module.exports = Note;
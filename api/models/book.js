const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isbn: {
    type: String
  },
  slugs: {
    type: [String]
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model("books", bookSchema);

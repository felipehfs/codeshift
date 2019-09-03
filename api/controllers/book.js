const Book = require("../models/book");

module.exports = {
  async readAll(req, res) {
    try {
      const perPage = 10;
      const actualPage = req.query.page || 1;
      const query = {};
      if (req.query.name) query.name = req.query.name;
      if (req.query.isbn) query.isbn = req.query.isbn;

      const books = await Book.find(query)
        .skip(perPage * actualPage - perPage)
        .limit(perPage);
      return res.json(books);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Um erro ocorreu no sistema"] });
    }
  },
  async details(req, res) {
    try {
      const book = await Book.findOne({ _id: req.params.id });
      return res.json(book);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: [err] });
    }
  },
  async create(req, res) {
    try {
      const book = await Book.create({
        name: req.body.name,
        isbn: req.body.isbn,
        slugs: req.body.slugs
      });

      return res.status(201).json(book);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: [err] });
    }
  },
  async remove(req, res) {
    try {
      await Book.findOneAndRemove({ _id: req.params.id });
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: [err] });
    }
  },
  async update(req, res) {
    try {
      await Book.findOneAndUpdate(req.params.id, {
        $set: {
          name: req.body.name,
          isbn: req.body.isbn,
          slugs: req.body.slugs
        }
      });

      const book = await Book.findById(req.params.id);
      return res.json(book);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ errors: ["Um erro ocorreu no sistema"] });
    }
  },
  async uploadImage(req, res) {
    if (req.files) {
      const file = req.files.image,
        filename = file.name;

      file.mv("/tmp/" + filename, function(err) {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ errors: ["Um erro ocorreu no upload do arquivo"] });
        }
        Book.findByIdAndUpdate(req.params.id, {
          $set: {
            image: filename
          }
        })
          .then(() => console.log("updated book"))
          .catch(err => {
            console.error(err);
            return res
              .status(500)
              .json({ errors: ["Um erro ocorreu no upload do arquivo"] });
          });
      });

      return res.status(204).send();
    }
  }
};

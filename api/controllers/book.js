const Book = require('../models/book');

module.exports = {
    async readAll(req, res) {
        try {
            const query = {};
            if (req.query.name) query.name = req.query.name;
            if (req.query.isbn) query.isbn = req.query.isbn;

            const books = await Book.find(query);
            return res.json(books);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ errors: [err] });
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
            return res.status(500).json({ errors: [err] });
        }
    }
}
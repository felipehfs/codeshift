const express = require("express");
const router = express.Router();
const passport = require("passport");

const bookHandler = require("../controllers/book");
const userHandler = require("../controllers/user");

// Rotas
router.post(
  "/api/books",
  passport.authenticate("jwt", { session: false }),
  bookHandler.create
);
router.get(
  "/api/books",
  passport.authenticate("jwt", { session: false }),
  bookHandler.readAll
);
router.get(
  "/api/books/:id",
  passport.authenticate("jwt", { session: false }),
  bookHandler.details
);
router.put(
  "/api/books/:id",
  passport.authenticate("jwt", { session: false }),
  bookHandler.update
);
router.delete(
  "/api/books/:id",
  passport.authenticate("jwt", { session: false }),
  bookHandler.remove
);
router.post(
  "/api/books/:id/upload",
  passport.authenticate("jwt", { session: false }),
  bookHandler.uploadImage
);

router.post("/api/register", userHandler.register);
router.post("/api/login", userHandler.login);

module.exports = router;

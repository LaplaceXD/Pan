const Joi = require("joi");
const express = require("express");
const router = express.Router();

const validator = require("../../middleware/validator");
const { getAllAlbums, addAlbum } = require("../services/album.service");

router.get("/", async (_, res) => {
  const albums = await getAllAlbums();

  res.status(200).send(albums);
});

router.post("/", [validator(validateAlbum)], async (req, res) => {
  const { month, year, album } = req.body;

  const addedAlbum = await addAlbum({ month, album, year });
  res.status(200).send(addedAlbum);
});

function validateAlbum(album) {
  const schema = Joi.object({
    year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
    month: Joi.string()
      .valid(
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      )
      .required(),
    album: Joi.string().min(5).max(300).required(),
  });

  return schema.validate(album);
}

module.exports = router;

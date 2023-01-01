const mongoose = require("mongoose");

const Reservation = mongoose.model(
  "Reservation",
  new mongoose.Schema({
    name: String,
    phonenumber: String,
    date: String,
    type: String,
    compaint: String,
    refering: String,
    age: String,
    bodypart: String,
    comment: String,
  })
);

module.exports = Reservation;

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Reservation = db.reservation;
var jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    role: req.body.roles,
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.send({ message: " New User Registered" });
    }
  });
};

exports.signin = (req, res) => {
  var users = req.body.username;
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (!(req.body.password == user.password)) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;
      if (users == "admin") {
        res.render(
          "J:/node-js-express-login-mongodb-master/views/homeAdmin.ejs"
        );
      } else if (users == "moderator") {
        res.render("J:/node-js-express-login-mongodb-master/views/homeMod.ejs");
      } else
        res.render("J:/node-js-express-login-mongodb-master/views/home.ejs");
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.reserve = (req, res) => {
  const reservation = new Reservation({
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    date: req.body.date,
    type: req.body.type,
    complaint: req.body.complaint,
    refering: req.body.refering,
    age: req.body.age,
    bodypart: req.body.bodypart,
    comment: req.body.comment,
  });
  reservation.save((err, reservation) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.send({ message: "reservation successful" });
    }
  });
};

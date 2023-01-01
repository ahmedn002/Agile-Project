const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");
const path = require("path");
const router = express.Router();

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true,
  })
);

const db = require("./app/models");
const { DefaultSerializer } = require("v8");
const Role = db.role;
const User = db.user;
const Reservation = db.reservation;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
    dadmin();
    dreservation();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function dadmin() {
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new User({
        username: "admin",
        password: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to users collection");
      });

      new User({
        username: "moderator",
        password: "mod",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'mod' to users collection");
      });
    }
  });
}

function dreservation() {
  Reservation.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Reservation({
        name: "Patient",
        phonenumber: "01028029981",
        date: "1/1/2023",
        type: "CT",
        complaint: "chestpain",
        refering: "Cardiologist",
        age: "22",
        bodypart: "chest",
        comment: "comment",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'Patient' to Reservations collection");
      });
    }
  });
}

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
app.use(express.static(path.join(__dirname + "/public")));

router.get("/", function (req, res) {
  res.render(path.join(__dirname + "/views/home.ejs"));
});
app.use("/", router);

router.get("/login", function (req, res) {
  res.render(path.join(__dirname + "/views/Login.ejs"));
});

router.get("/Register", function (req, res) {
  res.render(path.join(__dirname + "/views/Register.ejs"));
});

router.get("/Reservations", function (req, res) {
  res.render(path.join(__dirname + "/views/Reservations.ejs"));
});

router.get("/Dashboard", function (req, res) {
  res.render(path.join(__dirname + "/views/Dashboard.ejs"));
});

router.get("/RegisterMod", function (req, res) {
  res.render(path.join(__dirname + "/views/RegisterMod.ejs"));
});

router.get("/modDashboard", function (req, res) {
  res.render(path.join(__dirname + "/views/DashboardMod.ejs"));
});

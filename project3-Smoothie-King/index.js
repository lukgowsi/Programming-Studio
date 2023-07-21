const express = require("express");
//const fetch = require('node-fetch');

const { Pool } = require("pg");
const dotenv = require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

 

// Create express app
const app = express();
const port = 3000;

var firstName = null;
var lastName = null;
var isAdmin = false;
var isServer = false;
var isCustomer = false;

// Create pool
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
  ssl: { rejectUnauthorized: false },
});

/**
 * Handles the SIGINT signal to gracefully shutdown the application.
 */
process.on("SIGINT", function () {
  pool.end();
  console.log("Application successfully shutdown");
  process.exit(0);
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/views"));

app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * Authenticates the user using Google OAuth 2.0.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "947810255577-aggap7cvgjsnk288h2opb13igc811d0s.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL:
        "https://csce315-project3-73.onrender.com/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // This function will be called after successful authentication
      // You can use the "profile" object to get information about the authenticated user
      firstName = profile.name.givenName.toLowerCase();
      lastName = profile.name.familyName.toLowerCase();
      pool
        .query(
          `SELECT * FROM employees WHERE LOWER(firstname)='${firstName}' AND LOWER(lastname)='${lastName}'`
        )
        .then((result) => {
          if (result.rowCount > 0 && result.rows[0].isadmin) {
            isAdmin = true;
          } else if (result.rowCount > 0 && result.rows[0].isadmin == false) {
            isServer = true;
          } else {
            isCustomer = true;
          }
          done(null, profile);
        })
        .catch((error) => {
          console.error(error);
          done(error);
        });
    }
  )
);

/**
 * Serializes the authenticated user.
 */
passport.serializeUser(function (user, done) {
  done(null, user);
});

/**
 * Serializes the authenticated user.
 */
passport.deserializeUser(function (user, done) {
  done(null, user);
});

/**
 * Authenticates the user with Google OAuth 2.0.
 */
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

/**
 * Authenticates the user with Google OAuth 2.0.
 */
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // This function will be called after successful authentication
    // Redirect the user to the home page or some other page
    if (isAdmin) {
      res.redirect("/manager");
    } else if (isCustomer) {
      res.redirect("/customer");
    } else if (isServer) {
      res.redirect("/order");
    }
  }
);
///////////////////////
///////////////////////
/**
 * Middleware function to ensure that the user is authenticated.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const ensureAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
};

////////////////////////
/**
 * Renders the index page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/", (req, res) => {
  res.render("index");
});

/**
 * Renders the index page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/order", ensureAuthenticated, (req, res) => {
  if (isAdmin || isServer) {
    menuitems = [];
    pool.query("SELECT * FROM menu ORDER BY itemname;").then((query_res) => {
      for (let i = 0; i < query_res.rowCount; i++) {
        menuitems.push(query_res.rows[i]);
      }
      const data = { menuitems: menuitems };
      res.render("order", data);
    });
  } else {
    res.render("customer", data);
  }
});

/**
 * Renders the customer page if the user is authenticated as a customer.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/customer", ensureAuthenticated, (req, res) => {
 
    menuitems = [];
    pool.query("SELECT * FROM menu ORDER BY itemname;").then((query_res) => {
      for (let i = 0; i < query_res.rowCount; i++) {
        menuitems.push(query_res.rows[i]);
      }
      const data = { menuitems: menuitems };
      res.render("customer", data);
    }); 
});

/**
 * Renders the menu page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/menu", (req, res) => {
 
  menuitems = [];
  pool.query("SELECT * FROM menu ORDER BY itemname;").then((query_res) => {
    for (let i = 0; i < query_res.rowCount; i++) {
      menuitems.push(query_res.rows[i]);
    }
    const data = { menuitems: menuitems };
    res.render("menu", data);
  }); 
}); 

/**
 * Renders the menu page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/manager", ensureAuthenticated, (req, res) => {
  if (isAdmin) {
    // Query menu items
    const menuitems = [];
    pool
      .query("SELECT * FROM menu ORDER BY itemname;")
      .then((menu_query_res) => {
        for (let i = 0; i < menu_query_res.rowCount; i++) {
          menuitems.push(menu_query_res.rows[i]);
        }
        // Query inventory items
        const inventoryitems = [];
        pool
          .query("SELECT * FROM inventory;")
          .then((inventory_query_res) => {
            for (let i = 0; i < inventory_query_res.rowCount; i++) {
              console.log(inventory_query_res.rows[i]);
              inventoryitems.push(inventory_query_res.rows[i]);
            }
            // Send data to the manager view
            const data = {
              menuitems: menuitems,
              inventoryitems: inventoryitems,
            }; 
            res.render("manager", data);
          })
          .catch((error) => {
            console.error(error);
            res.render("error");
          });
      })
      .catch((error) => {
        console.error(error);
        res.render("error");
      });
  } else {
    res.render("order");
  }
});

/**
 * Handles the order query and sends the result as a response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/orderquery", (req, res) => {
  const query = req.query.query;
  pool
    .query(query)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
 
/**
 * Starts the server and listens on the specified port.
 * @returns {void}
 */
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


import express from "express";
import cors from "cors";
import { corsOptions } from "./configuration/corsOptions.js";
import { router } from "./routes/router.js";
import { Issuer } from "openid-client";

const app = express();

async function initializeClient() {
  const issuer = await Issuer.discover("https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_7dbHUtmP9");
  client = new issuer.Client({
    client_id: "2fi0i2fc10u19cbvqjhe36gkat",
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ["https://d84l1y8p4kdic.cloudfront.net"],
    response_types: ["code"],
  });
}
initializeClient().catch(console.error);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Routes
// app.use("/api", router);

app.get("/", checkAuth, (req, res) => {
  res.render("home", {
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo,
  });
});

app.get("/login", (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: "phone openid email",
    state: state,
    nonce: nonce,
  });

  res.redirect(authUrl);
});

/**
 * @route ALL *
 * @description Handles all other routes and returns a 404 error if the route is not found.
 * @access Public
 * @returns {object} Returns a JSON object with an error property indicating the route was not found.
 */
app.use("/", (req, res) => {
  res.status(404).json({ error: `The requested route ${req.originalUrl} was not found` });
});

function getPathFromURL(urlString) {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

app.get(getPathFromURL("https://d84l1y8p4kdic.cloudfront.net"), async (req, res) => {
  try {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback("https://d84l1y8p4kdic.cloudfront.net", params, {
      nonce: req.session.nonce,
      state: req.session.state,
    });

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;

    res.redirect("/");
  } catch (err) {
    console.error("Callback error:", err);
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  const logoutUrl = `https://<user pool domain>/logout?client_id=2fi0i2fc10u19cbvqjhe36gkat&logout_uri=<logout uri>`;
  res.redirect(logoutUrl);
});

app.set("view engine", "ejs");

export default app;

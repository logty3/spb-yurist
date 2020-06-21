const consultation = require("./consultation");
const services = require("./services");
const reviews = require("./reviews");
const blog = require("./blog");
const admin = require("./adminPanel");

const home = (req, res) => {
  const { isAdmin } = req.session;
  res.render("home", { active: "", isAdmin });
};
const contacts = (req, res) => {
  const { isAdmin } = req.session;
  res.render("contacts", { active: "contacts", isAdmin });
};
const about = (req, res) => {
  const { isAdmin } = req.session;
  res.render("about", { active: "about", isAdmin });
};
const practice = (req, res) => {
  const { isAdmin } = req.session;
  res.render("practice", { active: "practice", isAdmin });
};
const forms = (req, res) => {
  const { isAdmin } = req.session;
  res.render("forms", { active: "forms", isAdmin });
};

module.exports = {
  home,
  contacts,
  about,
  practice,
  forms,
  consultation,
  services,
  reviews,
  blog,
  admin,
};

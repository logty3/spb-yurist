const price = (req, res) => {
  const { isAdmin } = req.session;
  res.render("services/price", { active: "price", isAdmin });
};

const individuals = (req, res) => {
  const { isAdmin } = req.session;
  res.render("services/individuals", { active: "individuals", isAdmin });
};

const legalentities = (req, res) => {
  const { isAdmin } = req.session;
  res.render("services/legalentities", { active: "legalentities", isAdmin });
};

module.exports = {
  price,
  individuals,
  legalentities,
};

const { Reviews } = require("../models");
const { ADMIN_PASSWORD } = require("../../config");
const { validator } = require("../../utils");

const reviewAdd = async (req, res) => {
  const { name, text, owner } = req.body;

  const errors = [
    ...validator({ exists: true, min: 2, max: 32 })(name, "name"),
    ...validator({ exists: true, min: 5, max: 1000 })(text, "text"),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  try {
    const review = await Reviews.create({
      name,
      text,
      owner,
    }).select({ name: 1, text: 1, createdAt: 1, reviewId: 1 });

    res.json({
      ok: true,
      review,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const reviewsGet = async (req, res) => {
  let { page, perPage } = req.query;

  const errors = [
    ...validator({ exists: true, isNum: true, min: 1 })(page, "page"),
    ...validator({ exists: true, isNum: true, min: 1, max: 1000 })(
      perPage,
      "perPage"
    ),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  page = +page;
  perPage = +perPage;

  try {
    const count = await Reviews.countDocuments();
    const pages = Math.ceil(count / perPage);
    let reviews = await Reviews.find()
      .sort({ reviewId: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .select({ name: 1, text: 1, createdAt: 1, reviewId: 1 });

    if (reviews.length == 0) {
      const last = count % perPage || perPage;
      reviews = await Reviews.find()
        .sort({ reviewId: -1 })
        .skip(count - last)
        .select({ name: 1, text: 1, createdAt: 1, reviewId: 1 });
    }

    res.status(200).json({ ok: true, reviews, pages, page });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const reviewGet = async (req, res) => {
  const { reviewId } = req.params;

  const errors = [
    ...validator({
      exists: true,
      isNum: true,
      isPositive: true,
    })(reviewId, "reviewId"),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  try {
    const review = await Reviews.findOne({ reviewId }).select({
      name: 1,
      text: 1,
      createdAt: 1,
      reviewId: 1,
    });
    if (!review)
      return res.status(404).json({
        ok: false,
        errors: [{ message: "review not found" }],
      });
    res.json({
      ok: true,
      review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const reviewEdit = async (req, res) => {
  const { reviewId } = req.params;

  const { name, text, owner } = req.body;

  const errors = [
    ...validator({ exists: true, min: 2, max: 32 })(name, "name"),
    ...validator({ exists: true, min: 5, max: 1000 })(text, "text"),
    ...validator({
      exists: true,
      isNum: true,
      isPositive: true,
    })(reviewId, "reviewId"),
    ...validator({
      exists: true,
    })(owner, "owner"),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

  try {
    const review = await Reviews.findOneAndUpdate(
      { reviewId, owner },
      { name, text },
      {
        new: true,
      }
    ).select({ name: 1, text: 1, createdAt: 1, reviewId: 1 });

    if (!review) {
      return res.status(404).json({
        ok: false,
        errors: [{ message: "review not found" }],
      });
    }
    res.json({
      ok: true,
      review,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

const reviewDelete = async (req, res) => {
  const { reviewId } = req.params;
  const { authorization: password } = req.headers;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).end();
  }

  const errors = [
    ...validator({
      exists: true,
      isNum: true,
      isPositive: true,
    })(reviewId, "reviewId"),
  ];

  if (errors.length > 0) {
    return res.status(404).end();
  }

  try {
    const { deletedCount } = await Reviews.deleteOne({ reviewId });

    if (deletedCount == 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

module.exports = {
  reviewAdd,
  reviewsGet,
  reviewGet,
  reviewEdit,
  reviewDelete,
};

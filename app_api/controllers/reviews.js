const { Reviews } = require("../models");
const { ADMIN_PASSWORD } = require("../../config");

const reviewsGet = async (req, res) => {
  let reviews = null;
  const page = +req.query.page || 1;

  const perPage = +req.query.perPage || 1;
  let pages;
  try {
    const count = await Reviews.countDocuments();
    pages = Math.ceil(count / perPage);
    reviews = await Reviews.find()
      .sort({ reviewId: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);
    if (reviews.length == 0) {
      const last = count % 3 || perPage;
      reviews = await Reviews.find().limit(last);
      reviews.reverse();
    }
  } catch (err) {
    console.log(err);
    res.json({ ok: false, error: "Ошибка на сервере" });
  }
  console.log(reviews);
  res.json({ ok: true, reviews, pages, page });
};

const reviewGet = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Reviews.findOne({ reviewId });
    if (!review)
      return res.json({
        ok: false,
        error: "Отзыв не найден",
      });
    res.json({
      ok: true,
      review,
    });
  } catch (err) {
    console.log(err);
    res.json({
      ok: false,
      error: "Ошибка на сервере",
    });
  }
};

const reviewAdd = async (req, res) => {
  const { name, text, owner } = req.body;
  if (!name) {
    return res.json({
      ok: false,
      error: "Введите имя",
    });
  }
  if (name.length < 2) {
    return res.json({
      ok: false,
      error: "Слишком короткое имя",
    });
  }
  if (!text) {
    return res.json({
      ok: false,
      error: "Напишите отзыв",
    });
  }
  if (text.length < 5) {
    return res.json({
      ok: false,
      error: "Слишком короткий отзыв",
    });
  }

  try {
    const review = await Reviews.create({
      name,
      text,
      owner,
    });

    res.json({
      ok: true,
      review,
    });
  } catch (err) {
    console.log(err);
    res.json({
      ok: false,
      error: "Ошибка на сервере",
    });
  }
};

const reviewDelete = async (req, res) => {
  const { reviewId, password } = req.params;
  if (password != ADMIN_PASSWORD) {
    return res.status(403).end();
  }

  try {
    await Reviews.deleteOne({ reviewId });
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

const reviewEdit = async (req, res) => {
  const { reviewId } = req.params;

  const { name, text, owner } = req.body;

  try {
    const review = await Reviews.findOneAndUpdate(
      { reviewId, owner },
      { name, text }
    );

    res.json({
      ok: true,
      review,
    });
  } catch (err) {
    console.log(err);
    res.json({
      ok: false,
      error: "Ошибка на сервере",
    });
  }
};

module.exports = {
  reviewsGet,
  reviewGet,
  reviewAdd,
  reviewEdit,
  reviewDelete,
};

const {
  API_SERVER,
  REWIEWS_PER_PAGE,
  ADMIN_PASSWORD,
} = require("../../config");

const axios = require("axios");

const reviewsPage = async (req, res) => {
  const { isAdmin } = req.session;
  const { data } = await axios.get(`${API_SERVER}/reviews`, {
    params: { ...req.query, perPage: REWIEWS_PER_PAGE },
  });
  console.log(data);
  const { reviews, pages, page } = data;
  const { id: owner } = req.session;
  res.render("reviews", {
    active: "reviews",
    reviews,
    page,
    pages,
    isAdmin,
    owner,
  });
};

const reviewAdd = async (req, res) => {
  const { id } = req.session;

  const { data } = await axios.post(`${API_SERVER}/reviews`, {
    ...req.body,
    owner: id,
  });
  if (data.ok) {
    if (!req.session.reviews) {
      req.session.reviews = [];
    }
    const { reviewId } = data.review;
    req.session.reviews.push(reviewId);
  }

  res.json(data);
};

const reviewDelete = async (req, res) => {
  const { isAdmin, reviews } = req.session;
  const { reviewId } = req.params;

  if (isAdmin) {
    const { status } = await axios.delete(
      `${API_SERVER}/reviews/${reviewId}/${ADMIN_PASSWORD}`
    );
    return res.status(status).end();
  }

  if (reviews.indexOf(+reviewId) == -1) {
    return res.redirect(307, "/");
  }

  const { status } = await axios.delete(
    `${API_SERVER}/reviews/${reviewId}/${ADMIN_PASSWORD}`
  );

  res.status(status).end();
};

const reviewEdit = async (req, res) => {
  const { reviews, id } = req.session;
  const { reviewId } = req.params;
  if (reviews.indexOf(+reviewId) == -1) {
    return res.redirect(307, "/");
  }
  const { data } = await axios.put(`${API_SERVER}/reviews/${reviewId}`, {
    ...req.body,
    owner: id,
  });

  res.json(data);
};

module.exports = {
  reviewsPage,
  reviewAdd,
  reviewDelete,
  reviewEdit,
};

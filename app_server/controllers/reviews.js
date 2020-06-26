const {
  API_SERVER,
  REWIEWS_PER_PAGE,
  ADMIN_PASSWORD,
} = require("../../config");

const axios = require("axios");

const reviewAdd = async (req, res, next) => {
  const { id } = req.session;
  try {
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
  } catch (error) {
    const { data, status } = error.response;
    if (400 <= status < 500) {
      return res.status(status).json(data);
    }
    next(error);
  }
};

const reviewsPage = async (req, res, next) => {
  const { isAdmin } = req.session;
  try {
    const { data } = await axios.get(`${API_SERVER}/reviews`, {
      params: { page: 1, ...req.query, perPage: REWIEWS_PER_PAGE },
    });

    const { reviews, pages, page } = data;
    const { id: owner } = req.session;

    res.render("reviews/correctly", {
      active: "reviews",
      reviews,
      page,
      pages,
      isAdmin,
      owner,
    });
  } catch (error) {
    const { status, data } = error.response;
    if (400 <= status < 500) {
      const { errors } = data;
      return res.status(status).render("reviews/error", {
        active: "reviews",
        isAdmin,
        errors,
      });
    }
    next(error);
  }
};

const reviewEdit = async (req, res, next) => {
  const { reviews, id } = req.session;
  const { reviewId } = req.params;
  if (reviews.indexOf(+reviewId) == -1) {
    return res.status(403).json({
      ok: false,
      errors: [{ message: "access denied" }],
    });
  }

  try {
    const { data } = await axios.put(
      `${API_SERVER}/reviews/${reviewId}`,
      {
        ...req.body,
        owner: id,
      },
      {
        headers: {
          Authorization: ADMIN_PASSWORD,
        },
      }
    );

    res.json(data);
  } catch (error) {
    const { data, status } = error.response;
    if (400 <= status < 500) {
      return res.status(status).json(data);
    }
    next(error);
  }
};

const reviewDelete = async (req, res, next) => {
  const { isAdmin, reviews } = req.session;
  const { reviewId } = req.params;

  try {
    if (isAdmin) {
      const { status } = await axios.delete(
        `${API_SERVER}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: ADMIN_PASSWORD,
          },
        }
      );
      return res.status(status).end();
    }

    if (reviews.indexOf(+reviewId) == -1) {
      return res.status(403).end();
    }

    const { status } = await axios.delete(`${API_SERVER}/reviews/${reviewId}`, {
      headers: {
        Authorization: ADMIN_PASSWORD,
      },
    });

    res.status(status).end();
  } catch (error) {
    const { status } = error.response.status;
    if (400 <= status < 500) {
      return res.status(status).end();
    }
    next(error);
  }
};

module.exports = {
  reviewAdd,
  reviewsPage,
  reviewEdit,
  reviewDelete,
};

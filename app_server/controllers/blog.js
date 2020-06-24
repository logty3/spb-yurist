const { API_SERVER, POSTS_PER_PAGE } = require("../../config");

const axios = require("axios");

const blogPage = async (req, res, next) => {
  const { isAdmin } = req.session;
  try {
    const { data } = await axios.get(`${API_SERVER}/posts`, {
      params: { page: 1, ...req.query, perPage: POSTS_PER_PAGE },
    });

    const { posts, pages, page } = data;

    res.render("blog/blog/correctly", {
      active: "blog",
      posts,
      page,
      pages,
      isAdmin,
    });
  } catch (error) {
    const { status, data } = error.response;
    if (400 <= status < 500) {
      const { errors } = data;
      return res.status(status).render("blog/blog/error", {
        active: "blog",
        isAdmin,
        errors,
      });
    }
    next(error);
  }
};

const postPage = async (req, res, next) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  try {
    const { data } = await axios.get(
      encodeURI(`${API_SERVER}/posts/${postId}`)
    );

    const { post } = data;

    res.render("blog/post/correctly", { active: "blog", post, isAdmin });
  } catch (error) {
    const { status, data } = error.response;
    if (400 <= status < 500) {
      const { errors } = data;
      return res.status(status).render("blog/post/error", {
        active: "blog",
        isAdmin,
        errors,
      });
    }
    next(error);
  }
};

module.exports = {
  blogPage,
  postPage,
};

const { API_SERVER, POSTS_PER_PAGE } = require("../../config");

const axios = require("axios");

const blogPage = async (req, res) => {
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
    if (400 <= error.response.status < 500) {
      const { errors } = error.response.data;
      return res.render("blog/blog/error", {
        active: "blog",
        isAdmin,
        errors,
      });
    }
    next(error);
  }
};

const postPage = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  try {
    const { data } = await axios.get(`${API_SERVER}/posts/${postId}`);

    const { post } = data;

    res.render("blog/post", { active: "blog", post, isAdmin });
  } catch (error) {
    if (400 <= error.response.status < 500) {
      const { errors } = error.response.data;
      return res.render("blog/post/error", {
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

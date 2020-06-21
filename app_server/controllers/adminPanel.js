const { API_SERVER, ADMIN_PASSWORD } = require("../../config");

const axios = require("axios");

const adminAuth = (req, res) => {
  const { isAdmin } = req.session;
  if (!isAdmin) {
    const { password } = req.query;

    if (password != ADMIN_PASSWORD) {
      return res.redirect("/");
    }
    req.session.isAdmin = true;
    return res.redirect("/admin");
  }

  res.render("admin", {
    active: "admin",
    isAdmin,
  });
};

const postAddPage = (req, res) => {
  const { isAdmin } = req.session;
  if (!isAdmin) {
    return res.redirect("/");
  }

  res.render("admin/postAdd", {
    active: "admin",
    isAdmin,
  });
};

const postAdd = async (req, res) => {
  const { isAdmin } = req.session;
  if (!isAdmin) {
    return res.redirect(307, "/");
  }
  const { data } = await axios.post(`${API_SERVER}/posts`, {
    ...req.body,
    password: ADMIN_PASSWORD,
  });

  res.json(data);
};

const postDelete = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  if (!isAdmin) {
    return res.redirect(307, "/");
  }

  const { status } = await axios.delete(
    `${API_SERVER}/posts/${postId}/${ADMIN_PASSWORD}`
  );

  res.status(status).end();
};

const postEditPage = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  if (!isAdmin) {
    return res.redirect("/");
  }

  const { data } = await axios.get(`${API_SERVER}/posts/${postId}`);

  const { post } = data;

  res.render("admin/postEdit", {
    active: "admin",
    isAdmin,
    post,
  });
};

const postEdit = async (req, res) => {
  const { isAdmin } = req.session;
  const { postId } = req.params;
  if (!isAdmin) {
    return res.redirect(307, "/");
  }
  const { data } = await axios.put(`${API_SERVER}/posts/${postId}`, {
    ...req.body,
    password: ADMIN_PASSWORD,
  });

  res.json(data);
};

module.exports = {
  adminAuth,
  postAddPage,
  postAdd,
  postDelete,
  postEditPage,
  postEdit,
};

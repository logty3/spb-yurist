const { Posts } = require("../models");
const { ADMIN_PASSWORD } = require("../../config");
const { validator } = require("../utils");

const postsGet = async (req, res) => {
  let posts = null;
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 1;

  let pages;
  try {
    const count = await Posts.countDocuments();
    pages = Math.ceil(count / perPage);
    posts = await Posts.find()
      .sort({ postId: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);
    if (posts.length == 0) {
      const last = count % 3 || perPage;
      posts = await Posts.find().limit(last);
      posts.reverse();
    }
  } catch (err) {
    console.log(err);
    res.json({ ok: false, error: "Ошибка на сервере" });
  }

  res.json({ ok: true, posts, pages, page });
};

const postAdd = async (req, res) => {
  const { title, body, password } = req.body;
  if (password != ADMIN_PASSWORD) {
    return res.json({
      ok: false,
      error: "Неверный пароль",
    });
  }
  if (!title) {
    return res.json({
      ok: false,
      error: "Введите заголовок",
    });
  }
  if (title.length < 2) {
    return res.json({
      ok: false,
      error: "Заголовок слишком короткий",
    });
  }
  if (!body) {
    return res.json({
      ok: false,
      error: "Статья должна содержать текст",
    });
  }
  if (body.length < 5) {
    return res.json({
      ok: false,
      error: "Текст слишком короткий",
    });
  }

  try {
    await Posts.create({
      title,
      body,
    });

    res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      ok: false,
      error: "Ошибка на сервере",
    });
  }
};

const postGet = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findOne({ postId });
    if (!post)
      return res.json({
        ok: false,
        error: "Пост не найден",
      });
    res.json({
      ok: true,
      post,
    });
  } catch (err) {
    console.log(err);
    res.json({
      ok: false,
      error: "Ошибка на сервере",
    });
  }
};

const postDelete = async (req, res) => {
  const { postId, password } = req.params;
  if (password != ADMIN_PASSWORD) {
    return res.status(403).end();
  }

  try {
    await Posts.deleteOne({ postId });
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
};

const postEdit = async (req, res) => {
  const { postId } = req.params;

  const { title, body, password } = req.body;

  if (password != ADMIN_PASSWORD) {
    return res.status(403).end();
  }

  try {
    await Posts.findOneAndUpdate({ postId }, { title, body });
    res.json({
      ok: true,
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
  postAdd,
  postsGet,
  postGet,
  postEdit,
  postDelete,
};

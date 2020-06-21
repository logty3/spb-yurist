const { OUT_MAIL: user, TO_MAIL: to, PASSWORD: pass } = require("../../config");

const nodemailer = require("nodemailer");

const addConsultation = async (req, res) => {
  const { name, feedback, question } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
  const mailOptions = {
    to,
    subject: "Консультация",
    html: `
    <p>
      ${name} хочет связаться по следующему вопросу:
      ${question}
      Можно связаться следующим путём: ${feedback}
    </p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({
      ok: true,
    });
  } catch (err) {
    res.json({
      ok: false,
      error: "Ошибка на сервере",
    });
    console.log(err);
  }
};

module.exports = {
  addConsultation,
};

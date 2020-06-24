const { OUT_MAIL: user, TO_MAIL: to, PASSWORD: pass } = require("../../config");
const nodemailer = require("nodemailer");
const { validator } = require("../../utils");

const addConsultation = async (req, res) => {
  const { name, feedback, question } = req.body;

  const errors = [
    ...validator({ exists: true, min: 2, max: 32 })(name, "name"),
    ...validator({ exists: true, min: 8, max: 64 })(feedback, "feedback"),
    ...validator({ exists: true, min: 5, max: 200 })(question, "question"),
  ];

  if (errors.length > 0) {
    return res.status(400).json({
      ok: false,
      errors,
    });
  }

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
    console.log(err);
    res.status(500).json({
      ok: false,
      errors: [{ message: "Internal server error" }],
    });
  }
};

module.exports = {
  addConsultation,
};

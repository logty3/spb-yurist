import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/index.scss";
import "bootstrap";

const consultationForm = document.getElementById("consultation_form");
if (consultationForm) {
  consultationForm.onclick = (e) => {
    Array.from(consultationForm.getElementsByClassName("is-invalid")).forEach(
      (el) => {
        el.classList.remove("is-invalid");
      }
    );
  };

  const consultationNumber = document.getElementById("consultation-number");
  consultationNumber.onkeydown = (e) => {
    e.preventDefault();
    if (e.code == "Delete" || e.code == "Backspace") {
      if (consultationNumber.value.indexOf("_") != 2) {
        consultationNumber.value = consultationNumber.value
          .split("")
          .reverse()
          .join("")
          .replace(/\d/, "_")
          .split("")
          .reverse()
          .join("");
      }
    }
    if (/\d/.exec(e.key)) {
      consultationNumber.value = consultationNumber.value.replace("_", e.key);
    }
  };
  consultationNumber.onpaste = (e) => {
    e.preventDefault();
  };

  consultationForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(consultationForm);
    const body = {};
    for (let [name, value] of formData) body[name] = value;
    let haveError = false;
    if (
      body.name.match(/[^A-Za-zА-Яа-я\s]{2,32}/) ||
      body.name.length < 2 ||
      body.name.length > 32
    ) {
      consultationForm["consultation-name"].classList.add("is-invalid");
      haveError = true;
    }
    let numberErr = false;
    let emailErr = false;
    if (!body.number.match(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/)) {
      numberErr = true;
      body.number = null;
    }
    if (!body.email.match(/.+@.+\..+/i)) {
      emailErr = true;
      body.email = null;
    }
    if (numberErr && emailErr) {
      consultationForm["consultation-number"].classList.add("is-invalid");
      consultationForm["consultation-email"].classList.add("is-invalid");
      haveError = true;
    }
    if (
      body.question.match(/[^A-Za-zА-Яа-я\d\(\)\s]/) ||
      body.question.length < 5 ||
      body.question.length > 200
    ) {
      consultationForm["consultation-question"].classList.add("is-invalid");
      haveError = true;
    }
    if (haveError) {
      return;
    }
    const response = await fetch("/consultation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
  };
}

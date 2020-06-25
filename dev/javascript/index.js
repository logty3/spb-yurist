import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/index.scss";
import "bootstrap";

const consultationForm = document.getElementById("consultation_form");

const consultationNumber = document.getElementById("consultation-number");
/*
consultationNumber.onkeypress = (e) => {
  e.preventDefault();
  console.log(e.key);
  if (/\d/.exec(e.key)) {
    consultationNumber.value = consultationNumber.value.replace("_", e.key);
  }
};*/
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

consultationNumber.on;

consultationForm &&
  (consultationForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(consultationForm);
    const body = {};
    for (let [name, value] of formData) body[name] = value;
    console.log(body);
    consultationForm.classList.add("is-invalid");
    consultation - number;

    return;
    const response = await fetch("/consultation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
  });

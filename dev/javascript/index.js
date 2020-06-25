import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/index.scss";
import "bootstrap";

const consultationForm = document.getElementById("consultation_form");
if (consultationForm) {
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

  consultationNumber.on;

  consultationForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(consultationForm);
    const body = {};
    for (let [name, value] of formData) body[name] = value;
    console.log(body);

    return;
    const response = await fetch("/consultation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
  };
}

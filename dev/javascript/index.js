import "bootstrap/dist/css/bootstrap.min.css";
import "../stylesheets/index.scss";
import "bootstrap";

const consultationForm = document.getElementById("consultation_form");

consultationForm &&
  (consultationForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(consultationForm);
    let body = {};
    for (let [name, value] of formData) body[name] = value;

    const response = await fetch("/consultation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(data);
  });

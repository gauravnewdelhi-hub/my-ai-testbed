document.querySelector("#consultation-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const topic = document.querySelector("#topic").value;
  document.querySelector("#form-result").textContent =
    `Demo only: your selection (“${topic}”) was not sent or saved. Do not share confidential information.`;
});

const form = document.getElementById("my-form");
const result = document.getElementById("result");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    result.textContent = "Форма успешно отправлена";
});
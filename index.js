// alert("Working");
const form = document.querySelector("#form");
const output = document.querySelector("#output");
let url = "https://api.funtranslations.com/translate/minion.json?";

function errorHandler(error) {
  alert("Sorry! Error :(, Try again later!");
  console.log(error);
}

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  let dataurl = `${url}text=${form.elements.word.value}`;
  fetch(dataurl).then((res) => {
    res
      .json()
      .then((data) => {
        console.log(data);
        console.log(data.contents.translated);
        output.innerText = `${data.contents.translated}`;
      })
      .catch((error) => {
        errorHandler(error);
      });
  });
});

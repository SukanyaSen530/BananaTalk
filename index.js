const form = document.querySelector("#form");
const output = document.querySelector("#output");
const copyButton = document.getElementById("copy-button");

const url = "https://api.funtranslations.com/translate/minion.json?";

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

// SW needs to be registered in all pages so better to keep in js file which is used everywhere
if ("serviceWorker" in navigator) {
  console.log("Service Worker Supported!"); // To check if browser supports it

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw_cached_site.js")
      .then((reg) => {
        console.log("Service Worker Registered!");
      })
      .catch((err) => console.log(`Service Worker Error ${err}`));
  });
}

copyButton.addEventListener("click", () => {
  const textarea = document.querySelector(".translated-box");
  const text = textarea?.value.trim();

  if (!text) {
    alert("No text to copy.");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Text copied!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
});

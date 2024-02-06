//Variables

let quote = document.getElementById("quote");
let author = document.getElementById("author");
let btn = document.getElementById("new-quote");

const url = "https://api.quotable.io/random";


let getQuote = () => {
    fetch(url)
      .then((data) => data.json())
      .then((item) => {
        console.log("API Response:", item);
        quote.innerText = item.content;
        author.innerText = item.author;
      });
  };

window.addEventListener("load", getQuote);
btn.addEventListener("click", getQuote);
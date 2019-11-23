window.onload = () => {
  var link = document.getElementById("link"),
    shorten = document.getElementById("shorten"),
    danger = document.querySelector(".Danger"),
    spinner = document.getElementById("spinner");

  shorten.addEventListener("click", shortenLink);

  function shortenLink() {
    validation();

    if (validation()) {
      spinner.style.display = "flex";

      fetch("https://rel.ink/api/links/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: link.value })
      })
        .then(res => res.json())
        .then(data => {
          if (data.url.length === 1) {
            danger.innerHTML = data.url.join(" ");
            link.style.border = "2px solid rgb(253, 78, 78)";

            spinner.style.display = "none";
          } else {
            danger.innerHTML = "";
            link.style.border = "1px solid rgba(0, 0, 0, 0.1)";

            createItem(link.value.trim(), data.hashid);
            link.value = "";

            spinner.style.display = "none";
          }
        })
        .catch(er => {
          danger.innerHTML = er;
          link.style.border = "2px solid rgb(253, 78, 78)";

          spinner.style.display = "none";
        });
    }
  }

  function validation() {
    if (link.value.trim() === "") {
      danger.innerHTML = "Please add a link";
      link.style.border = "2px solid rgb(253, 78, 78)";

      return false;
    } else return true;
  }

  function createItem(link, hashid) {
    var shortLink = "https://rel.ink/" + hashid;

    displayItems(link, shortLink);

    let data = {
      link,
      shortLink
    };
    store(data);
  }

  function addEvents() {
    var copyBtn = document.querySelectorAll("#copy");
    copyBtn.forEach(el => el.addEventListener("click", copyText));
  }

  var menu = document.querySelector(".menu");
  var nav__details = document.querySelector(".nav__details");
  menu.addEventListener("click", toggleNavDetails);
  var openNav = false;

  function toggleNavDetails() {
    openNav = openNav ? false : true;

    if (openNav) {
      nav__details.style.flexBasis = "auto";
    } else {
      nav__details.style.flexBasis = "0";
    }
  }

  addEvents();

  function copyText(e) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = e.target.previousSibling.previousSibling.innerText;
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    // Changing Style
    e.target.innerHTML = "Copied!";
    e.target.classList.add("copied-btn");

    setTimeout(function() {
      e.target.innerHTML = "Copy";
      e.target.classList.remove("copied-btn");
    }, 3000);
  }

  // Using Local Storage
  function store(item) {
    let items = get();
    items.push(item);

    localStorage.setItem("items", JSON.stringify(items));
  }

  function get() {
    let items;

    if (localStorage.getItem("items") == null) {
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem("items"));
    }

    return items;
  }

  // Displaying Items
  function displayItems(link, shortLink) {
    var container = document.querySelectorAll(".container")[1];
    var state = document.querySelector(".state");
    var div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
    <a href="${link}" class="item__actual-link">
        ${link}
  </a>
  <a id="short-link" href="${shortLink}" class="item__short-link">
        ${shortLink}
  </a>
  <button id="copy" class="item__btn btn-primary btn-primary--sm btn-primary--rounded-sm">
    Copy
  </button>
    `;

    container.insertBefore(div, state);

    addEvents();
  }

  let items = get();
  items.forEach(v => {
    console.log(v);
    displayItems(v.link, v.shortLink);
  });
};

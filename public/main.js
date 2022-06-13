// const { async } = require("jshint/src/prod-params")

const edit = document.querySelectorAll(".editGame");
const update = document.querySelectorAll(".updateGame");


let editArray = Array.from(edit).forEach((element) => {
  element.addEventListener("click", editGameInfo);
});

let updateArray = Array.from(update).forEach((element) => {
  element.addEventListener("click", editGameInfo);
});

async function editGameInfo(event) {
  let target = event.target;
  let fields = target.parentNode.children;
  let fieldsArray = Array.from(fields).slice(0, -2);
  if (target.classList.contains("editGame")) {
    fieldsArray.forEach((item) => item.setAttribute("contenteditable", true));
    
  }

  if (target.classList.contains("updateGame")) {
    fieldsArray.forEach((item) => item.setAttribute("contenteditable", false));
// get the element text from the fields and put into post below on update
    updateGameInfo();
  }
}

async function updateGameInfo() {
   const title =document.querySelector('#title').innerText // use something like target .childnode.innertext to get it to work
   const release =document.querySelector('#release').innerText
   const developer =document.querySelector('#developer').innerText
   const platform =document.querySelector('#platform').innerText
   console.log('release' +release)
  await fetch("/games", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title, // have to find a way to update the field on input
      release: release,
      developer:developer,
      platform:platform

    }),
  });
}

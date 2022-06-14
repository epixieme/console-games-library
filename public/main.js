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
  const id = target.parentNode.childNodes[1].innerText
  const title = target.parentNode.childNodes[5].innerText
  const release = target.parentNode.childNodes[9].innerText
  const developer = target.parentNode.childNodes[13].innerText
  const platform = target.parentNode.childNodes[17].innerText
  console.log(title)
  if (target.classList.contains("editGame")) {
    fieldsArray.forEach((item) => item.setAttribute("contenteditable", true));
    
  }

  if (target.classList.contains("updateGame")) {
    fieldsArray.forEach((item) => item.setAttribute("contenteditable", false));
// get the element text from the fields and put into post below on update
    updateGameInfo(id,title,release,developer,platform);
  }
}

async function updateGameInfo(id,title,release,developer,platform) {
    console.log('id' + id)
  await fetch("/games", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title, // have to find a way to update the field on input
      release: release,
      developer:developer,
      platform:platform,
      id:id

    }),
  });
}
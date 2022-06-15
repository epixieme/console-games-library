// const { async } = require("jshint/src/prod-params")

const edit = document.querySelectorAll(".editGame");
const update = document.querySelectorAll(".updateGame");
const deleteGame = document.querySelectorAll(".deleteGame");

const editArray = Array.from(edit).forEach((element) => {
  element.addEventListener("click", editGameInfo); /// hears the click and calls editGameInfo
});

const updateArray = Array.from(update).forEach((element) => {
  element.addEventListener("click", editGameInfo); /// hears the click editGameInfo
});

const deleteArray = Array.from(deleteGame).forEach((element) => {
  element.addEventListener("click", deleteGameInfo); /// hears the click editGameInfo
});

async function editGameInfo(event) {
  const target = event.target;
  let fields = target.parentNode.children;

  let fieldsArray = Array.from(fields).slice(0, -2);

  console.log(document.getElementsByName("title")[0].value); /// how can I make this section dryer - maybe an object? could I use this query selector and a conidtion? https://bobbyhadz.com/blog/javascript-get-data-attribute-from-event-object
  // grabs all of the dom element (span) innertext for the target
  const id = target.parentNode.childNodes[1].innerText;/// take it from the live value?
  const title = target.parentNode.childNodes[5].innerText;
  const release = target.parentNode.childNodes[9].innerText;
  const developer = target.parentNode.childNodes[13].innerText;
  const platform = target.parentNode.childNodes[17].innerText;
  // console.log(title);

  if (target.classList.contains("editGame")) {
    fieldsArray.forEach((item) => item.setAttribute("contenteditable", true));
  } else if (target.classList.contains("updateGame")) {
    fieldsArray.forEach((item) => item.setAttribute("contenteditable", false));
    // get the element text from the fields and put into post below on update
    updateGameInfo(id, title, release, developer, platform);
  }
}

async function updateGameInfo(id, title, release, developer, platform) {
  await fetch("/games", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // Send these as a string to the server
      title: title, // have to find a way to update the field on input
      release: release,
      developer: developer,
      platform: platform,
      id: id,
    }),
  });
}

async function deleteGameInfo(event) {
  console.log("delete");
  const target = event.target;


  // console.log(document.querySelectorAll(".elements")); /// how can I make this section dryer - maybe an object? could I use this query selector and a conidtion? https://bobbyhadz.com/blog/javascript-get-data-attribute-from-event-object
  // grabs all of the dom element (span) innertext for the target

  const title = target.parentNode.childNodes[5].innerText;
 
  try {
    const response = await fetch("/deleteGames", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Send these as a string to the server
        title: title, // have to find a way to update the field on input
      }),
    });
    const data = await response.json();
    location.reload();
  } catch (err) {}
}

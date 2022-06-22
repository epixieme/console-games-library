// const { async } = require("jshint/src/prod-params")

const edit = document.querySelectorAll(".editGame");
const update = document.querySelectorAll(".updateGame");
const deleteGame = document.querySelectorAll(".deleteGame");

const searchBtn = document.querySelectorAll('.button')

const editArray = Array.from(edit).forEach((element) => {
  element.addEventListener("click", editGameInfo); /// hears the click and calls editGameInfo
});

const updateArray = Array.from(update).forEach((element) => {
  element.addEventListener("click", editGameInfo); /// hears the click editGameInfo
});

const deleteArray = Array.from(deleteGame).forEach((element) => {
  element.addEventListener("click", deleteGameInfo); /// hears the click editGameInfo
});

// searchBtn.addEventListener('click',searchGameInfo)

function editGameInfo(event) {
  const target = event.target;
  let fields = target.parentNode.parentNode.children;
  console.log(target.parentNode.parentNode.childNodes);
  let fieldsArray = Array.from(fields);
  console.log("this is fieldsarray" + fieldsArray);
  //update childnodes to reflect additon of cards section etc

  console.log(document.getElementsByName("title")[0].value); /// how can I make this section dryer - maybe an object? could I use this query selector and a conidtion? https://bobbyhadz.com/blog/javascript-get-data-attribute-from-event-object
  // grabs all of the dom element (span) innertext for the target
  const id = target.parentNode.parentNode.childNodes[1].innerText; /// take it from the live value?
  console.log(id);
  const title = target.parentNode.parentNode.childNodes[5].innerText;
  console.log(title);
  const release = target.parentNode.parentNode.childNodes[9].innerText;
  const developer = target.parentNode.parentNode.childNodes[13].innerText;
  const platform = target.parentNode.parentNode.childNodes[17].innerText;
  // console.log(title);

  if (target.classList.contains("editGame")) {
    fieldsArray.forEach((item) => {
      item.setAttribute("contenteditable", true);
      item.style.border = "1px solid grey";
      item.style.borderRadius = "10px";
    });
    // document.querySelectorAll('.elements').contenteditable.foreach(item=>item.style.border='red solid 1px')
  } else if (target.classList.contains("updateGame")) {
    fieldsArray.forEach((item) => {
      item.setAttribute("contenteditable", false);
      item.style.border = "none";
      item.style.borderRadius = "10px";
    });
    // get the element text from the fields and put into post below on update
    updateGameInfo(id, title, release, developer, platform);
  }
}

async function updateGameInfo(id, title, release, developer, platform) {

  try {
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
} catch (err) {}
}



async function deleteGameInfo(event) {
  console.log("delete");
  const target = event.target;

  // console.log(document.querySelectorAll(".elements")); /// how can I make this section dryer - maybe an object? could I use this query selector and a conidtion? https://bobbyhadz.com/blog/javascript-get-data-attribute-from-event-object
  // grabs all of the dom element (span) innertext for the target

  const title = target.parentNode.parentNode.childNodes[5].innerText;

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

// add condition if input is empty then prevent submit, same for search field
// add a search reset button or reset on backbutton?
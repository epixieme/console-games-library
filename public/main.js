const { async } = require("jshint/src/prod-params")

const edit= document.querySelector('.editGame')
const update = document.querySelector('.update')// add this to ejs and do a hide and show when edit button is clicked
update.addEventListener('click',  editGame)

  async function editGame (){

      await fetch('/names', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${title.value}`,// have to find a way to update the field on input
          release: `${title.release}`
        })
      })

  }
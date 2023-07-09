import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://we-are-the-champions-8162b-default-rtdb.firebaseio.com",
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const commentEl = document.getElementById("commentEl")
const commentFromEl = document.getElementById("commentFromEl")
const commentToEl = document.getElementById("commentToEl")
const publishBtn = document.getElementById("publishBtn")
const endorsementContainer = document.getElementById("endorsements-list")

publishBtn.addEventListener("click", function () {
  let comment = commentEl.value
  let fromValue = commentFromEl.value
  let toValue = commentToEl.value
  let likeCount = 0

  let newComment = {
    commentDB: comment,
    fromDB: fromValue,
    toDB: toValue,
    likeCount: likeCount,
  }

  push(endorsementsInDB, newComment)
  clearInputFields()
})

onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementsArray = Object.entries(snapshot.val())

    endorsementContainer.innerHTML = ""

    for (let i = 0; i < endorsementsArray.length; i++) {
      let currentItem = endorsementsArray[i]
      let endorsementValue = currentItem[0]
      let endorsementID = currentItem[1]

      addEndorsement(endorsementValue, endorsementID)
    }
  } else {
    endorsementContainer.innerHTML = ""
  }
})

function clearInputFields() {
  commentEl.value = ""
  commentFromEl.value = ""
  commentToEl.value = ""
}

function addEndorsement(endorsementID, endorsementValue) {
  let newEndorsement = document.createElement("div")

  newEndorsement.className = "endorsement-item"
  newEndorsement.innerHTML = `<p class="bold">To ${endorsementValue.toDB}</p>
  <p>${endorsementValue.commentDB}</p>
  <div class="footer">
    <p class="bold">From ${endorsementValue.fromDB}</p>
    <p id="${endorsementID}" class="likes"><span>❤️</span> ${endorsementValue.likeCount}</p>
  </div>`

  let likeBtn = newEndorsement.querySelector(`#${endorsementID}`)
  likeBtn.addEventListener("click", function () {
    endorsementValue.likeCount += 1
    likeBtn.innerHTML = `❤️ ${endorsementValue.likeCount}`

    let likesInDB = ref(database, `endorsements/${endorsementID}/likeCount`)
    set(likesInDB, endorsementValue.likeCount)
  })

  endorsementContainer.prepend(newEndorsement)
}

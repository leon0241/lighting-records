let addButton = document.getElementById("addAnotherRecord")
let group = document.getElementById("recordData1")
let container = document.getElementById("addRecords")

addButton.addEventListener("click", (e) => {
  let newGroup = group.cloneNode(true)
  container.appendChild(newGroup)
  container.scrollTop = container.scrollHeight;
})

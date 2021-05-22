let addButton = document.getElementById("addAnotherRecord");
let group = document.getElementById("recordData1");
let container = document.getElementById("addRecords");
addButton.addEventListener("click", (e) => {
    let newGroup = group.cloneNode(true);
    container.appendChild(newGroup);
    container.scrollTop = container.scrollHeight;
});

let db = firebase.firestore();

db.collection("artists").add({
    band: true,
    genres: ["rock"],
    name: "linkin park"
})

.then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
let addButton = document.getElementById("addAnotherRecord");
let group = document.getElementById("recordGroup1");
let container = document.getElementById("addRecords");

let index = 1;

addButton.addEventListener("click", (e) => {
	index += 1;
	let newGroup = group.cloneNode(true);
	let rows = [newGroup.childNodes[1], newGroup.childNodes[3]];
	rows.forEach((row) => {
		console.log(row)
		let rowArray = [...row.childNodes]
		console.log(rowArray)
		rowArray.forEach((item) => {
			console.log(item.nodeName)
			if (item.nodeName === "INPUT") {
				let prevID = item.id
				let newID = `${prevID.slice(0, -1)}${index}`
				console.log(newID)
				item.id = newID
				item.setAttribute("name", newID)
			} else if (item.nodeName === "LABEL") {
				let prevID = item.getAttribute("for")
				let newID = `${prevID.slice(0, -1)}${index}`
				item.setAttribute("for", newID)
			}
		})
	})

	newGroup.id = `recordGroup${index}`
	console.log(newGroup)
	container.appendChild(newGroup);
	container.scrollTop = container.scrollHeight;
});

// let db = firebase.firestore();

// db.collection("artists").add({
//     band: true,
//     genres: ["rock"],
//     name: "linkin park"
// })

// .then((docRef) => {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch((error) => {
//     console.error("Error adding document: ", error);
// });
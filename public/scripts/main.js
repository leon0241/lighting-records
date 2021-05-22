let addButton = document.getElementById("addAnotherRecord");
let group = document.getElementById("recordGroup1");
let container = document.getElementById("addRecords");

let index = 1;

addButton.addEventListener("click", (e) => {
	index += 1;
	// Copy nodes
	let newGroup = group.cloneNode(true);
	// Array from input row, and check row
	let rows = [newGroup.childNodes[1], newGroup.childNodes[3]];

	// For each for both rows
	rows.forEach((row) => {
		// Array from nodes in row
		let rowArray = [...row.childNodes]

		//For each for nodes in row
		rowArray.forEach((item) => {
			// Check if type is input
			if (item.nodeName === "INPUT") {
				// get ID
				let preVal = item.id
				// Remove number from end and add index
				let newVal = `${preVal.slice(0, -1)}${index}`

				// Set ID and name attribute to newID
				item.id = newVal
				item.setAttribute("name", newVal)

				if(item.getAttribute("type") === "text") {
					item.value = ""	
				} else {
					item.checked = false
				}

			// Check if type is label
			} else if (item.nodeName === "LABEL") {
				// Get for attribute
				let preVal = item.getAttribute("for")
				// Set new attribute
				let newVal = `${preVal.slice(0, -1)}${index}`
				item.setAttribute("for", newVal)
			}
		})
	})

	newGroup.id = `recordGroup${index}`
	console.log(newGroup)
	container.appendChild(newGroup);
	container.scrollTop = container.scrollHeight;

	let currentInput = document.getElementById(`songTitle${index}`)
	currentInput.focus()
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
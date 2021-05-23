let addButton = document.getElementById("addAnotherRecord");
let group = document.getElementById("recordGroup0");
let container = document.getElementById("addRecords");
let artistBox = document.getElementById("artistName")

let artistHandler = document.getElementsByClassName("artistHandler")

let addWordsContainer = document.getElementById("addView")
let viewWordsContainer = document.getElementById("viewView")

let db = firebase.firestore();
let artistDB = db.collection("artists")
let recordDB = db.collection("records")

let index = 0;
let artistFound = false;
let artistID = "";

// querySnapshot.forEach((doc) => {
// 	console.log(doc.id, " => ", doc.data());
// })

document.getElementById("viewRecordsBtn").addEventListener("click", (e) => {
	addWordsContainer.style.display = "none";
	viewWordsContainer.style.display = "flex";
})

document.getElementById("addRecordsBtn").addEventListener("click", (e) => {
	addWordsContainer.style.display = "flex";
	viewWordsContainer.style.display = "none";
})

artistName.addEventListener("change", (e) => {
	let term = artistBox.value

	artistDB.where("name", "==", term)
		.get()
		.then((querySnapshot) => {
			if (querySnapshot.empty) {
				noArtist(true)
			} else {
				querySnapshot.forEach((doc) => {
					artistID = doc.id
				})
				noArtist(false)
			}
		})
		.catch((error) => {
			console.log("error getting documents: ", error)
		})
})

function noArtist (bool) {
	if (bool) {
		artistFound = false;

		artistHandler[0].style.display = "inline"
		artistHandler[1].style.display = "none"
		document.getElementById("artistBand").disabled = false;
		document.getElementById("forArtistBand").classList.remove("disabled");
	} else {
		artistFound = true;

		artistHandler[1].style.display = "inline"
		artistHandler[0].style.display = "none"
		document.getElementById("artistBand").disabled = true;
		document.getElementById("forArtistBand").classList.add("disabled");
	}
}

addButton.addEventListener("click", (e) => {
	index += 1;
	// Copy nodes
	let newGroup = group.cloneNode(true);
	// Array from input row, and check row
	let rows = [newGroup.children[0], newGroup.children[1]];

	// For each rows
	rows.forEach((row) => {
		// Array from nodes in row
		let rowArray = [...row.children]

		//For each node in row
		rowArray.forEach((divNodes) => {
			console.log(divNodes)

			// Array from divs in node
			let divArray = [...divNodes.children]
			console.log(divArray)

			// For each div in node
			divArray.forEach((item) => {
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
	})

	newGroup.id = `recordGroup${index}`
	console.log(newGroup)
	container.appendChild(newGroup);
	container.scrollTop = container.scrollHeight;

	let currentInput = document.getElementById(`songTitle${index}`)
	currentInput.focus()
});

function submitForm(that) {
	let valueArr = that.elements

	// Fill out artist object
	let artistValues = {
		artistName: valueArr["artistName"].value,
		bandCheck: valueArr["artistBand"].checked,
	}

	let recordValues = []
	let seclen = container.children.length - 1

	// Repeat for how many record sections there are
	for (let i = 0; i < seclen; i++) {
		// Fill out record object
		let recordValue = {
			recordName: valueArr[`songTitle${i}`].value,
			recordYear: valueArr[`songYear${i}`].value,
			recordArt: valueArr[`coverArt${i}`].checked,
			recordDmg: valueArr[`coverDmg${i}`].checked,
			recordDupe: valueArr[`duplicate${i}`].checked
		}

		// Append to array of objects
		recordValues.push(recordValue)
	}
	console.log(recordValues)

	addToFirestore(artistValues, recordValues)
}

function addToFirestore(artist, records) {
	// check if there is an artist found
	if (artistFound === false) {
		artistDB.add({
			band: artist.bandCheck,
			name: artist.artistName
		})
		.then((docref) => {
			artistID = docref.id
			let artistRef = artistDB.doc(artistID)
			addRecords(records, artistRef)
		})
	} else {
		let artistRef = artistDB.doc(artistID)
		addRecords(records, artistRef)
	}
}

function addRecords(records, artistRef) {
	records.forEach((record) => {
		recordDB.add({
			artist: artistRef,
			damaged: record.recordDmg,
			duplicate: record.recordDupe,
			name: record.recordName,
			original: record.recordArt,
			year: record.recordYear
		})
	})
}

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
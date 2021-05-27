let addButton = document.getElementById("addAnotherRecord");
let group = document.getElementById("recordGroup0");
let container = document.getElementById("addRecords");
let artistBox = document.getElementById("artistName");

let artistHandler = document.getElementsByClassName("artistHandler");

let addWordsContainer = document.getElementById("addView");
let viewWordsContainer = document.getElementById("viewView");
let wordSectionContainer = document.getElementById("addRecords")
let tableBody = document.getElementById("tableBody")
let recordForm = document.getElementById("recordForm")

let db = firebase.firestore();
let artistDB = db.collection("artists");
let recordDB = db.collection("records");

let index = 0;
let artistFound = false;
let artistID = "";



// querySnapshot.forEach((doc) => {
// 	console.log(doc.id, " => ", doc.data());
// })
// let unsubscribe

let yearGroup = document.getElementsByClassName("yearInput")

// for each year group input
Array.from(yearGroup).forEach((element) => {
  element.addEventListener("keyup", (e) => {
    let content = element.value

    // if value is longer than 2
    if (content.length > 2) {
      // slice off the last letter
      element.value = element.value.slice(0, -1)
    }
  })
})

// clear a record row thing
function clearChild(that) {
  console.log(that)
  let xParent = that

  // while the parent is not higher than the container
  while (xParent.parentNode != wordSectionContainer) {
    // traverse 1 layer up
    xParent = xParent.parentNode
  }

  // remove child
  wordSectionContainer.removeChild(xParent)
}

recordDB.orderBy("")

// On snapshot aka database change
recordDB.orderBy("artist").onSnapshot((doc) => {
  // TODO: should be a better way to do this
  tableBody.innerHTML = ""

  // document array
  let collection = doc.docs

  // for each entry in array
  collection.forEach((entry) => {
    // set data
    let newItem = entry.data()
    newItem.id = entry.id

    // if there's artist field
    if (newItem.artist) {
      // get data of artist
      newItem.artist.get()
        .then((artistDoc) => {
          // store artist data into a new value
          newItem.artistData = artistDoc.data()

          //create table element with data
          createTableElement(newItem)
        })
        .catch(err => {console.error(err)})
    } else {
      // else just create table element 
      createTableElement(newItem)
    }
  })
})

// creates table elements
function createTableElement(data) {
  // text values
  let values = [
    data.name,
    data.artistData.name,
    data.year,
  ]

  // bool checks
  let checkValues = [
    data.original,
    data.damaged,
    data.duplicate
  ]

  // new row at end
  let row = tableBody.insertRow(-1)

  // for each value insert row text
  values.forEach((element, index) => {
    let newCell = row.insertCell(index)
    let cellText = document.createTextNode(element)
    newCell.appendChild(cellText)
  })

  // for each value insert row checkbox
  checkValues.forEach((element, index) => {
    // offset row text
    let newCell = row.insertCell(index + values.length)
    newCell.classList.add("tableCheckbox")
    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")

    // set checkbox to true or false
    if (element === true) {
      checkbox.checked = true
    } else {
      checkbox.checked = false
    }
    newCell.appendChild(checkbox)
  })
}

// view records button view
document.getElementById("viewRecordsBtn").addEventListener("click", (e) => {
  addWordsContainer.style.display = "none";
  viewWordsContainer.style.display = "flex";
});

// add records button view
document.getElementById("addRecordsBtn").addEventListener("click", (e) => {
  addWordsContainer.style.display = "flex";
  viewWordsContainer.style.display = "none";
});

// On artist name box change
artistName.addEventListener("change", (e) => {
  // Set compare term
  let term = artistBox.value;

  // looks in artistDB where name == term
  artistDB
    .where("name", "==", term)
    // gets value
    .get()
    // then, check querySnapshot
    .then((querySnapshot) => {
      // if querySnapshot is empty
      if (querySnapshot.empty) {
        // no artist DOM manipulation
        noArtist(true);
        // if querySnapshot isn't empty
      } else {
        // set the id to the found doc's id
        querySnapshot.forEach((doc) => {
          artistID = doc.id;
        });
        // found artist DOM manipulation
        noArtist(false);
      }
    })
    // if error send error message
    .catch((error) => {
      console.log("error getting documents: ", error);
    });
});

// Styling dom showing if there's an artist or not
function noArtist(bool) {
  if (bool) {
    artistFound = false;

    artistHandler[0].style.display = "inline";
    artistHandler[1].style.display = "none";
    document.getElementById("artistBand").disabled = false;
    document.getElementById("forArtistBand").classList.remove("disabled");
  } else {
    artistFound = true;

    artistHandler[1].style.display = "inline";
    artistHandler[0].style.display = "none";
    document.getElementById("artistBand").disabled = true;
    document.getElementById("forArtistBand").classList.add("disabled");
  }
}

// Shortcut for ctrl + insert
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key == "Insert") {
    addNewRow(e)
  }
})

// Event listener for add button onclick
addButton.addEventListener("click", addNewRow);

// Adds a new row
function addNewRow() {
  index += 1;
  // Copy nodes
  let newGroup = group.cloneNode(true);
  // Array from input row, and check row
  let rows = [newGroup.children[0], newGroup.children[1]];

  // For each rows
  rows.forEach((row) => {
    // Array from nodes in row
    let rowArray = [...row.children];

    //For each node in row
    rowArray.forEach((divNodes) => {

      // Array from divs in node
      let divArray = [...divNodes.children];

      // For each div in node
      divArray.forEach((item) => {
        // Check if type is input
        if (item.nodeName === "INPUT") {
          // get ID
          let preVal = item.id;
          // Remove number from end and add index
          let newVal = `${preVal.slice(0, -1)}${index}`;

          // Set ID and name attribute to newID
          item.id = newVal;
          item.setAttribute("name", newVal);

          if (item.getAttribute("type") === "text") {
            item.value = "";
          } else {
            item.checked = false;
          }

          // Check if type is label
        } else if (item.nodeName === "LABEL") {
          // Get for attribute
          let preVal = item.getAttribute("for");
          // Set new attribute
          let newVal = `${preVal.slice(0, -1)}${index}`;
          item.setAttribute("for", newVal);
        }
      });
    });
  });

  // Set the id of the group
  newGroup.id = `recordGroup${index}`;

  // Append the child to container
  container.appendChild(newGroup);

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;

  // Set input to the textbox
  let currentInput = document.getElementById(`songTitle${index}`);
  currentInput.focus();
}

// Submits the form
function submitForm(that) {
  let valueArr = that.elements;

  // Fill out artist object
  let artistValues = {
    artistName: valueArr["artistName"].value,
    bandCheck: valueArr["artistBand"].checked,
  };

  let recordValues = [];
  let seclen = container.children.length - 1;

  // Repeat for how many record sections there are
  for (let i = 0; i < seclen; i++) {
    // Fill out record object
    let recordValue = {
      recordName: valueArr[`songTitle${i}`].value,
      recordYear: `19${valueArr[`songYear${i}`].value}`,
      recordArt: valueArr[`coverArt${i}`].checked,
      recordDmg: valueArr[`coverDmg${i}`].checked,
      recordDupe: valueArr[`duplicate${i}`].checked,
    };

    // Append to array of objects
    recordValues.push(recordValue);
  }

  // adds 2 arrays to firstore
  addToFirestore(artistValues, recordValues);

  recordForm.reset()
}

// Adds records and artists to firestore collections
function addToFirestore(artist, records) {
  // check if there is an artist found
  if (artistFound === false) {
    // Add entry to artistDB
    artistDB
      .add({
        band: artist.bandCheck,
        name: artist.artistName,
      })
      // Then, store the id and add record
      .then((docref) => {
        artistID = docref.id;

        // Store reference to ID
        let artistRef = artistDB.doc(artistID);

        // call add records function
        addRecords(records, artistRef);
      });
    // If artist is found
  } else {
    // Store reference to ID
    let artistRef = artistDB.doc(artistID);

    // Call add records function
    addRecords(records, artistRef);
  }
}

// Add records to record collection
function addRecords(records, artistRef) {
  // for each value in record
  records.forEach((record) => {
    // add to record with values
    recordDB.add({
      artist: artistRef,
      damaged: record.recordDmg,
      duplicate: record.recordDupe,
      name: record.recordName,
      original: record.recordArt,
      year: record.recordYear,
    });
  });
}

let artistFound = false;
let artistID = "";

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                            |
|  General DOM Manipulation  |
|                            |
\___________________________*/

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

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                             |
|  Write firestore functions  |
|                             |
\____________________________*/

// On artist name box change
artistName.addEventListener("change", (e) => {
  // Set compare term
  let term = artistName.value;

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

function resetForm() {
  let arr = recordSectionContainer.children;
  Array.from(arr).forEach((e) => {
    if (e.id != "recordGroup0" && e.id != "submitGroup") {
      recordSectionContainer.removeChild(e);
    }
  });

  recordForm.reset();
}

// Submits the form
function submitForm(that) {
  let valueArr = that.elements;
  rowIndex = 0;

  // Fill out artist object
  let artistValues = {
    artistName: valueArr["artistName"].value,
    bandCheck: valueArr["artistBand"].checked,
  };

  let recordValues = [];
  let seclen = recordSectionContainer.children.length - 1;

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

  resetForm();

  artistName.focus();
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

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                            |
|  Read firestore functions  |
|                            |
\___________________________*/

let database = db.collection("artistsNew");

newArtistDB
  .orderBy("name")
  .get()
  .then((querySnapshot) => {
    tableBody.innerHTML = "";

    querySnapshot.forEach((doc) => {
      let recordsList = doc.ref.collection("recordDB");
      let artistName = doc.data().name;
      console.log(doc.data());

      recordsList
        .orderBy("title")
        .get()
        .then((recordSnap) => {
          recordSnap.forEach((recordDoc) => {
            let data = recordDoc.data();
            data.artistRef = artistName;
            addTableRow(data);
          });
        });
    });
  });

function addTableRow(data) {
  console.log(data);
  console.log(data.title, data.artistRef);

  let stringValues = [data.title, data.artistRef, data.year];

  let checkValues = Object.values(data.checks);
  console.log(checkValues);

  let row = tableBody.insertRow(-1);

  // for each value insert row text
  stringValues.forEach((element, index) => {
    let newCell = row.insertCell(index);
    let cellText = document.createTextNode(element);
    newCell.appendChild(cellText);
  });

  checkValues.forEach((element, index) => {
    let newCell = row.insertCell(index + stringValues.length);
    newCell.classList.add("tableCheckbox");
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");

    checkbox.checked = element === true ? true : false;

    newCell.appendChild(checkbox);
  });
}

// // On snapshot aka database change
// recordDB.orderBy("name").onSnapshot(doc => {
//   // TODO: should be a better way to do this
//   tableBody.innerHTML = ""

//   // document array
//   let collection = doc.docs

//   // for each entry in array
//   collection.forEach((entry) => {
//     // set data
//     let newItem = entry.data()
//     newItem.id = entry.id

//     // if there's artist field
//     if (newItem.artist) {
//       // get data of artist
//       newItem.artist.get()
//         .then((artistDoc) => {
//           // store artist data into a new value
//           newItem.artistData = artistDoc.data()

//           //create table element with data
//           createTableElement(newItem)
//         })
//         .catch(err => {console.error(err)})
//     } else {
//       // else just create table element
//       createTableElement(newItem)
//     }
//   })
// })

// creates table elements
function createTableElement(data) {
  // text values
  let values = [data.name, data.artistData.name, data.year];

  // bool checks
  let checkValues = [data.original, data.damaged, data.duplicate];

  // new row at end
  let row = tableBody.insertRow(-1);

  // for each value insert row text
  values.forEach((element, index) => {
    let newCell = row.insertCell(index);
    let cellText = document.createTextNode(element);
    newCell.appendChild(cellText);
  });

  // for each value insert row checkbox
  checkValues.forEach((element, index) => {
    // offset row text
    let newCell = row.insertCell(index + values.length);
    newCell.classList.add("tableCheckbox");
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");

    // set checkbox to true or false
    if (element === true) {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
    newCell.appendChild(checkbox);
  });
}

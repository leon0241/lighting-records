let addButton = document.getElementById("addAnotherRecord");
let group = document.getElementById("recordGroup0");
let container = document.getElementById("addRecords");
let artistBox = document.getElementById("artistName");

let artistHandler = document.getElementsByClassName("artistHandler");

let addWordsContainer = document.getElementById("addView");
let viewWordsContainer = document.getElementById("viewView");
let tempdeposit = document.getElementById("allrecords")

let db = firebase.firestore();
let artistDB = db.collection("artists");
let recordDB = db.collection("records");

let index = 0;
let artistFound = false;
let artistID = "";

// querySnapshot.forEach((doc) => {
// 	console.log(doc.id, " => ", doc.data());
// })
let unsubscribe

recordDB.onSnapshot((doc) => {
  tempdeposit.innerHTML = ""
  console.log(doc)
  console.log(doc.docs)
  console.log(doc.size)
  console.log(doc.docs[(doc.size - 1)])
  console.log(doc.docs[doc.size - 1].data())

  let item = doc.docs[doc.size - 1]
  let data = doc.docs[doc.size - 1].data()
  let newItem = data

  doc.docs.forEach(docc => {
    let newItem = docc.data()
    newItem.id = docc.id
    console.log(newItem)

    if (newItem.artist) {
      newItem.artist.get().then((duck) => {
        newItem.artistData = duck.data()
        appendRecordDOM(newItem)
      })
        .catch(err => { console.error(err) });
    } else {
      appendRecordDOM(newItem)
    }
  })  
})

// window.onload = (e) => {
//   recordDB.get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       // console.log(`${doc.id} => ${doc.data()}`);
//       // appendRecordDOM(doc.data())

//       let newItem = doc.data()
//       newItem.id = doc.id
//       if (newItem.artist) {
//         newItem.artist.get().then((duck) => {
//           newItem.artistData = duck.data()
//           appendRecordDOM(newItem)
//         })
//         .catch(err => { console.error(err) });
//       } else {
//         appendRecordDOM(newItem)
//       }
//     });
//   });
// };

function appendRecordDOM(data) {
  let appenderSpan = document.createElement("span");
  appenderSpan.classList.add("recordValue");
  appenderSpan.textContent = `${data.name} - ${data.artistData.name} - ${data.damaged} - ${data.duplicate} - ${data.original} - ${data.year}`;
  tempdeposit.appendChild(appenderSpan);
}

document.getElementById("viewRecordsBtn").addEventListener("click", (e) => {
  addWordsContainer.style.display = "none";
  viewWordsContainer.style.display = "flex";
});

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

addButton.addEventListener("click", (e) => {
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
});

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
      recordYear: valueArr[`songYear${i}`].value,
      recordArt: valueArr[`coverArt${i}`].checked,
      recordDmg: valueArr[`coverDmg${i}`].checked,
      recordDupe: valueArr[`duplicate${i}`].checked,
    };

    // Append to array of objects
    recordValues.push(recordValue);
  }
  console.log(recordValues);

  // adds 2 arrays to firstore
  addToFirestore(artistValues, recordValues);
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

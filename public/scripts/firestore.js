console.log("2")
let artistFound = false;
let artistID = "";
let database = db.collection("artistsNew");

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

// submits the form
function submitForm(that) {
  // array of form elements
  let valueArr = that.elements;
  // reset row index to 0
  rowIndex = 0;

  let artistValues = {
    name: valueArr["artistName"].value.toLowerCase(),
    band: valueArr["artistBand"].checked,
  }

  let recordValues = []
  let seclen = recordSectionContainer.children.length - 1;

  // Repeat for how many record sections there are
  for (let i = 0; i < seclen; i++) {
    // Fill out record object
    let recordValue = {
      title: valueArr[`songTitle${i}`].value.toLowerCase(),
      year: `19${valueArr[`songYear${i}`].value}`,
      checks: {
        damaged: valueArr[`coverDmg${i}`].checked,
        duplicate: valueArr[`coverArt${i}`].checked,
        original: valueArr[`duplicate${i}`].checked,
      }
    }

    // Append to array of objects
    recordValues.push(recordValue);
  }

  // adds artist + record values to firestore database
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
    .add(artist)
    // Then, store the id and add record
    .then((docref) => {
      artistID = docref.id;

      // Store reference to subcollection
      let subcollection = docref.collection("recordDB")

      // Call add records function
      addRecords(records, subcollection);
    });

  // If artist is found
  } else {
    // Store reference to subcollection
    let artistRef = artistDB.doc(artistID);
    let subcollection = artistRef.collection("recordDB")

    // Call add records function
    addRecords(records, subcollection);
  }
}

// Add records to record collection
function addRecords(records, collection) {
  // for each value in record, add to record with values
  records.forEach(record => collection.add(record));
}

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                            |
|  Read firestore functions  |
|                            |
\___________________________*/


artistDB.orderBy("name").get({ source: 'cache' })
.then((querySnapshot) => {
  if (querySnapshot.empty) {
    artistDB.orderBy("name").get({ source: 'server' })
    .then((querySnapshot) => {
      loadDatabase(querySnapshot)
    })
    console.log("server")
  } else {
    loadDatabase(querySnapshot)
    console.log("cache")
  }
})

function loadDatabase(querySnapshot) {
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
}

// artistDB.get({source: "cache"}).then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     console.log(doc.data())
//   })
// })

// orderby name > title
// artistDB.limit(20)
//   .orderBy("name")
//   .get()
//   .then((querySnapshot) => {
//     tableBody.innerHTML = "";

//     querySnapshot.forEach((doc) => {
//       let recordsList = doc.ref.collection("recordDB");
//       let artistName = doc.data().name;
//       console.log(doc.data());

//       recordsList
//         .orderBy("title")
//         .get()
//         .then((recordSnap) => {
//           recordSnap.forEach((recordDoc) => {
//             let data = recordDoc.data();
//             data.artistRef = artistName;
//             addTableRow(data);
//           });
//         });
//     });
//   });

// add row dom
function addTableRow(data) {

  let stringValues = [data.title, data.artistRef, data.year];

  let checkValues = Object.values(data.checks);

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





//OLD CODE
// // On snapshot aka database change
// recordDB.orderBy("name").get().then(querySnapshot => {
//   // TODO: should be a better way to do this
//   tableBody.innerHTML = ""

//   // document array
//   let collection = querySnapshot

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


/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                                        |
|  Scuffed Database migration algorithm  |
|                                        |
\_______________________________________*/

// // define artist list (DO NOT TRY AT HOME)
// let artistList = [];

// // get all records then ->
// recordDB.get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     // Get document data
//     let data = doc.data();

//     // Restructured data format for record
//     let recordValues = {
//       // Map with checkboxes
//       checks: {
//         damaged: data.damaged,
//         duplicate: data.duplicate,
//         original: data.original,
//       },
//       title: data.name.toLowerCase(),
//       year: data.year,
//     };

//     // Get record artist then ->
//     data.artist
//       .get()
//       // Set artistData to document artist data, then ->
//       .then((artistDoc) => {
//         data.artistData = artistDoc.data();
//       })

//       // Add data to database
//       .then((e) => {
//         // Convert text to lowercase
//         let artistValues = {
//           band: data.artistData.band,
//           name: data.artistData.name.toLowerCase(),
//         };

//         // Super scuffed method, other one doesn't work - listed below this

//         console.log(artistValues)
//         console.log(recordValues)

//         // if record artist name is in the array then ->
//         if (artistList.includes(artistValues.name)) {
//           //Get artistDB where name == record artist name then ->
//           artistDB
//             .where("name", "==", artistValues.name)
//             .get()

//             // Add data to database
//             .then((querySnapshot) => {
//               // Set artist reference variable as querySnapshot data
//               let artist = querySnapshot.docs[0];

//               // Point into collection recordDB in artist
//               let recordsColl = artist.ref.collection("recordDB");

//               // Add document in collection with record values
//               recordsColl.add(recordValues);
//             });

//           // If record artist isn't in array
//         } else {
//           // Put the record artist into the array
//           artistList.push(artistValues.name);

//           // Add new artist with artist values then ->
//           artistDB
//             .add(artistValues)
//             // Add document to collection with record values
//             .then((docref) => {
//               docref.collection("recordDB").add(recordValues);
//             })
//             .catch((error) => console.log(error));
//         }

//         // This should work but doesn't for some reason

//         // Get artist DB where name = artist name then ->
//         // artistDB
//         //   .where("name", "==", artistValues.name)
//         //   .get()
//         //   .then((querySnapshot) => {
//         //     // Check if querysnapshot is empty
//         //     if (querySnapshot.empty) {
//         //       // If it is, means no artist was found

//         //       // Add new artist with artist values then ->
//         //       artistDB
//         //         .add(artistValues)
//         //         // Add document to collection with record values
//         //         .then((docref) => {
//         //           docref.collection("recordDB").add(recordValues);
//         //         })
//         //         .catch((error) => console.log(error));

//         //       // If querysnapshot isn't empty
//         //     } else {
//         //       // Set artist reference variable as querySnapshot data
//         //       let artist = querySnapshot.docs[0];

//         //       // Point into collection recordDB in artist
//         //       let recordsColl = artist.ref.collection("recordDB");

//         //       // Add document in collection with record values
//         //       recordsColl.add(recordValues);
//         //     }
//         //   })
//         //   .catch((error) => console.log(error));
//       })
//       .catch((error) => console.log(error));
//   });
// });
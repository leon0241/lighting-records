let database = db.collection("artistsNew")

// let a = database.orderBy("Name").get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     console.log(doc)
//     console.log(doc.id, ' => ', doc.data());

//     let recordsList = doc.ref.collection("rec")

//     recordsList.orderBy("name").get().then((q) => {
//       q.forEach((doc) => {
//         console.log(doc.id, ' => ', doc.data());
//       })
//     })
//   })
// })


/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                            |
|  Read firestore functions  |
|                            |
\___________________________*/

newArtistDB.orderBy("name").get().then((querySnapshot) => {
  tableBody.innerHTML = ""

  querySnapshot.forEach((doc) => {
    let recordsList = doc.ref.collection("recordDB")
    let artistName = doc.data().name
    console.log(doc.data())

    recordsList.orderBy("title").get().then((recordSnap) => {
      recordSnap.forEach((recordDoc) => {
        let data = recordDoc.data()
        data.artistRef = artistName
        addTableRow(data)
      })
    })
  })
})

function addTableRow(data) {
  console.log(data)
  console.log(data.title, data.artistRef)

  let stringValues = [
    data.title,
    data.artistRef,
    data.year
  ]

  let checkValues = Object.values(data.checks)
  console.log(checkValues)

  let row = tableBody.insertRow(-1)

  // for each value insert row text
  stringValues.forEach((element, index) => {
    let newCell = row.insertCell(index)
    let cellText = document.createTextNode(element)
    newCell.appendChild(cellText)
  })

  checkValues.forEach((element, index) => {
    let newCell = row.insertCell(index + stringValues.length)
    newCell.classList.add("tableCheckbox")
    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")

    checkbox.checked = (element === true) ? true : false
    
    newCell.appendChild(checkbox)
  })
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
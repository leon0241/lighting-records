let rowIndex = 0;

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                           |
|  General Event Listeners  |
|                           |
\__________________________*/

// view records button view
viewRecordsButton.addEventListener("click", (e) => {
  addWordsContainer.style.display = "none";
  profileContainer.style.display = "none";
  viewWordsContainer.style.display = "flex";
  addRecordsButton.classList.remove("navSelected");
  viewRecordsButton.classList.add("navSelected");
});

// add records button view
addRecordsButton.addEventListener("click", (e) => {
  addWordsContainer.style.display = "flex";
  viewWordsContainer.style.display = "none";
  profileContainer.style.display = "none";
  viewRecordsButton.classList.remove("navSelected");
  addRecordsButton.classList.add("navSelected");
});

let yearGroup = document.getElementsByClassName("yearInput");

// for each year group input
Array.from(yearGroup).forEach((element) => {
  element.addEventListener("keyup", (e) => {
    let content = element.value;

    // if value is longer than 2
    if (content.length > 2) {
      // slice off the last letter
      element.value = element.value.slice(0, -1);
    }
  });
});

// Add a new row on ctrl + insert
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key == "Insert") {
    addNewRow(e);
  } else if (e.ctrlKey && e.key == "Delete") {
    let newest = recordSectionContainer.lastChild;
    recordSectionContainer.removeChild(newest);
    rowIndex -= 1;
  }
});

// Event listener for add button onclick
addButton.addEventListener("click", addNewRow);

document.getElementById("filterToggle").addEventListener("click", (e) => {
  if (queryContainer.style.display === "none") {
    queryContainer.style.display = "flex";
  } else {
    queryContainer.style.display = "none";
  }
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

// Adds a new row
function addNewRow() {
  rowIndex += 1;
  // Copy nodes
  let newGroup = firstRecordGroup.cloneNode(true);
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
        if (item.nodeName === "INPUT" || item.nodeName === "DIV") {
          if (item.nodeName === "DIV") {
            item = item.children[1];
          }

          // get ID
          let preVal = item.id;
          // Remove number from end and add index
          let newVal = `${preVal.slice(0, -1)}${rowIndex}`;

          // Set ID and name attribute to newID
          item.id = newVal;
          item.setAttribute("name", newVal);

          console.log(item.getAttribute("type"));

          let itemAttribute = item.getAttribute("type");

          if (itemAttribute === "text") {
            item.value = "";
          } else if (itemAttribute === "number") {
            item.value = "";
          } else if (itemAttribute === "checkbox") {
            item.checked = false;
          }

          // Check if type is label
        } else if (item.nodeName === "LABEL") {
          // Get for attribute
          let preVal = item.getAttribute("for");
          // Set new attribute
          let newVal = `${preVal.slice(0, -1)}${rowIndex}`;
          item.setAttribute("for", newVal);
        }
      });
    });
  });

  // Set the id of the group
  newGroup.id = `recordGroup${rowIndex}`;

  // Append the child to container
  recordSectionContainer.appendChild(newGroup);

  // Scroll to bottom
  recordSectionContainer.scrollTop = recordSectionContainer.scrollHeight;

  // Set input to the textbox
  let currentInput = document.getElementById(`songTitle${rowIndex}`);
  currentInput.focus();
}

// clear a record row thing
function clearChild(that) {
  console.log(that);
  let xParent = that;

  // while the parent is not higher than the container
  while (xParent.parentNode != recordSectionContainer) {
    // traverse 1 layer up
    xParent = xParent.parentNode;
  }

  // remove child
  recordSectionContainer.removeChild(xParent);
}

profilePopup.addEventListener("mouseover", (e) => {
  dropdownContent.style.display = "flex";
});

profilePopup.addEventListener("mouseout", (e) => {
  dropdownContent.style.display = "none";
});

viewProfileButton.addEventListener("click", (e) => {
  addWordsContainer.style.display = "none";
  viewWordsContainer.style.display = "none";
  profileContainer.style.display = "flex";
  addRecordsButton.classList.remove("navSelected");
  viewRecordsButton.classList.remove("navSelected");
});

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                           |
|  Firebase Authentication  |
|                           |
\__________________________*/

loginButton.addEventListener("click", (e) => {
  auth.signInWithPopup(provider);
});

logoutButton.addEventListener("click", (e) => {
  auth.signOut();
});

auth.onAuthStateChanged((user) => {
  if (user) {
    logoutButton.style.display = "inline";
    loginButton.style.display = "none";
    viewProfileButton.classList.remove("hideProfileButton");
    userProfileTitle.textContent = `Profile - ${user.displayName}`;
  } else {
    loginButton.style.display = "inline";
    logoutButton.style.display = "none";
    viewProfileButton.classList.add("hideProfileButton");
    userProfileTitle.textContent = ``;
  }
});

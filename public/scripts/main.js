let rowIndex = 0;

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                           |
|  General Event Listeners  |
|                           |
\__________________________*/

/*
 - Navigation buttons
*/

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
  addRecordsButton.classList.add("navSelected");
  viewRecordsButton.classList.remove("navSelected");
});

viewProfileButton.addEventListener("click", (e) => {
  addWordsContainer.style.display = "none";
  profileContainer.style.display = "flex";
  viewWordsContainer.style.display = "none";
  addRecordsButton.classList.remove("navSelected");
  viewRecordsButton.classList.remove("navSelected");
});

/*
 - Year input check
*/

// for each year group input
Array.from(document.getElementsByClassName("yearInput")).forEach((element) => {
  element.addEventListener("keyup", (e) => {
    let content = element.value;

    // if value is longer than 2
    if (content.length > 2) {
      // slice off the last letter
      element.value = element.value.slice(0, -1);
    }
  });
});

/*
 - Profile pop up
*/

// Event listener for hover over profile pop up
profilePopup.addEventListener("mouseover", (e) => {
  dropdownContent.style.display = "flex";
});

// Event listener for hover out profile pop up
profilePopup.addEventListener("mouseout", (e) => {
  dropdownContent.style.display = "none";
});

/*
 - Keyboard Shortcuts
*/

// Add a new row on ctrl + insert
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key == "Insert") {
    addNewRow(e);

  // Remove last child on ctrl + delete
  } else if (e.ctrlKey && e.key == "Delete") {
    let newest = recordSectionContainer.lastChild;
    recordSectionContainer.removeChild(newest);
    rowIndex -= 1;
  }
});

// Event listener for add button onclick
addButton.addEventListener("click", addNewRow);

// Event listener for filter options
document.getElementById("filterToggle").addEventListener("click", (e) => {
  queryContainer.style.display =
    (queryContainer.style.display === "none") ? "flex" : "none";
});


/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                          |
|  Querying records stuff  |
|                          |
\_________________________*/

primaryAscend.addEventListener("click", (e) => {
  primaryAscend.classList.contains("descendingOrder") === false
    ? primaryAscend.classList.add("descendingOrder")
    : primaryAscend.classList.remove("descendingOrder");
});

secondaryAscend.addEventListener("click",  (e) => {
  secondaryAscend.classList.contains("descendingOrder") === false
    ? secondaryAscend.classList.add("descendingOrder")
    : secondaryAscend.classList.remove("descendingOrder");
})

primarySort.addEventListener("change", (e) => {
  if (primarySort.value != "sortArtist") {
    secondarySort.disabled = true;
    secondaryAscend.style.pointerEvents = "none"
    secondaryAscend.style.opacity = "50%"
  }
})


/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                           |
|  Functions and stuff idk  |
|                           |
\__________________________*/


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

// resets the form
function resetForm() {
  // dom(?) arr of children
  let arr = recordSectionContainer.children;

  // for each element of arr converted to array
  Array.from(arr).forEach((e) => {
    // if it's not the first or submit group then ->
    if (e.id != "recordGroup0" && e.id != "submitGroup") {
      // remove child
      recordSectionContainer.removeChild(e);
    }
  });

  // reset form
  recordForm.reset();
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

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                           |
|  Firebase Authentication  |
|                           |
\__________________________*/

// On login button click
loginButton.addEventListener("click", (e) => {
  auth.signInWithPopup(provider);
});

// On logout button click
logoutButton.addEventListener("click", (e) => {
  auth.signOut();
});

// On log in state changed
auth.onAuthStateChanged((user) => {
  // If signed in
  if (user) {
    logoutButton.style.display = "inline";
    loginButton.style.display = "none";
    viewProfileButton.classList.remove("hideProfileButton");
    userProfileTitle.textContent = `Profile - ${user.displayName}`;

  // If not signed in
  } else {
    loginButton.style.display = "inline";
    logoutButton.style.display = "none";
    viewProfileButton.classList.add("hideProfileButton");
    userProfileTitle.textContent = ``;
  }
});

/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾ ‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                                   |
|  DOM Variables(vanilla js sucks)  |
|                                   |
\__________________________________*/

// Navbar
const viewRecordsButton = document.getElementById("viewRecordsButton");
const addRecordsButton = document.getElementById("addRecordsButton");

// Navbar - Login popup
const profilePopup = document.getElementById("navProfile");
const dropdownContent = document.getElementById("dropdownContent");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const viewProfileButton = document.getElementById("viewProfileButton");

// Main Containers
const addWordsContainer = document.getElementById("addView");
const viewWordsContainer = document.getElementById("viewView");
const profileContainer = document.getElementById("profileView");

// Add Words
const recordForm = document.getElementById("recordForm");

// Add Words - Artist Name
const artistName = document.getElementById("artistName");
const artistHandler = document.getElementsByClassName("artistHandler");

// Add Words - Record Group
const recordSectionContainer = document.getElementById("addRecords");
const firstRecordGroup = document.getElementById("recordGroup0");

// Add Words - Add Another Record Button
const addButton = document.getElementById("addAnotherRecord");

// View Words
const tableBody = document.getElementById("tableBody");

// View Words - Query Fields Container
const queryContainer = document.getElementById("queryFields");

// View Words - Query Individual Fields
const queryTitle = document.getElementById("queryTitle");
const queryArtist = document.getElementById("queryArtist");
const queryYearMin = document.getElementById("queryYearMin");
const queryYearMax = document.getElementById("queryYearMax");

// View Words - Query checkbox fields
const queryTickFields = document.getElementsByClassName("queryTickLabels")
const columnTickFields = document.getElementsByClassName("columnTickLabels")

// View Words - Query select fields
const primarySort = document.getElementById("primarySort")
const primaryAscend = document.getElementById("primaryAscend")
const secondarySort = document.getElementById("secondarySort")
const secondaryAscend = document.getElementById("secondaryAscend")

// View Words - Query Buttons
const queryReset = document.getElementById("queryResetButton")
const querySubmit = document.getElementById("querySubmitButton")

// User Profile
const userProfileTitle = document.getElementById("userProfileTitle");

let db = firebase.firestore();
console.log("1")
//Firebase Firestore

db.settings({
  cacheSizeBytes: db.CACHE_SIZE_UNLIMITED
});

db.enablePersistence()
.catch((err) => {
  if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
  } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
  } else {
    console.log(err)
  }
});

const recordDB = db.collection("records");
const artistDB = db.collection("artistsDB");

// Firebase Authentication
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
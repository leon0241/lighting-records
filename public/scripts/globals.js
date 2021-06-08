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

// Containers
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

// User Profile
const userProfileTitle = document.getElementById("userProfileTitle");

//Firebase Firestore
// let db = firebase.firestore();
// let artistDB = db.collection("artists");
// let recordDB = db.collection("records");
// let newArtistDB = db.collection("artistDB");

// Firebase Authentication
// const auth = firebase.auth();
// const provider = new firebase.auth.GoogleAuthProvider();
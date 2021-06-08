/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾ ‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                                   |
|  DOM Variables(vanilla js sucks)  |
|                                   |
\__________________________________*/

// Navbar
let viewRecordsButton = document.getElementById("viewRecordsButton");
let addRecordsButton = document.getElementById("addRecordsButton");

// Navbar - Login popup
let profilePopup = document.getElementById("navProfile");
let dropdownContent = document.getElementById("dropdownContent");
let loginButton = document.getElementById("loginButton");
let logoutButton = document.getElementById("logoutButton");
let viewProfileButton = document.getElementById("viewProfileButton");

// Containers
let addWordsContainer = document.getElementById("addView");
let viewWordsContainer = document.getElementById("viewView");
let profileContainer = document.getElementById("profileView");

// Add Words
let recordForm = document.getElementById("recordForm");

// Add Words - Artist Name
let artistName = document.getElementById("artistName");
let artistHandler = document.getElementsByClassName("artistHandler");

// Add Words - Record Group
let recordSectionContainer = document.getElementById("addRecords");
let firstRecordGroup = document.getElementById("recordGroup0");

// Add Words - Add Another Record Button
let addButton = document.getElementById("addAnotherRecord");

// View Words
let tableBody = document.getElementById("tableBody");

// View Words - Query Fields Container
let queryContainer = document.getElementById("queryFields");

// View Words - Query Individual Fields
let queryTitle = document.getElementById("queryTitle");
let queryArtist = document.getElementById("queryArtist");

// User Profile
let userProfileTitle = document.getElementById("userProfileTitle");

//Firebase Firestore
let db = firebase.firestore();
let artistDB = db.collection("artists");
let recordDB = db.collection("records");
let newArtistDB = db.collection("artistDB");

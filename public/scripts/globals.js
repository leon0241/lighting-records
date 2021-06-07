/*‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾ ‾‾‾‾‾‾‾‾‾‾‾‾‾\
|                                   |
|  DOM Variables(vanilla js sucks)  |
|                                   |
\__________________________________*/

let addButton = document.getElementById("addAnotherRecord");
let group = document.getElementById("recordGroup0");
let container = document.getElementById("addRecords");

let artistName = document.getElementById("artistName");

let queryTitle = document.getElementById("queryTitle")
let queryArtist = document.getElementById("queryArtist")

let artistHandler = document.getElementsByClassName("artistHandler");

let addWordsContainer = document.getElementById("addView");
let viewWordsContainer = document.getElementById("viewView");
let wordSectionContainer = document.getElementById("addRecords")
let tableBody = document.getElementById("tableBody")
let recordForm = document.getElementById("recordForm")

let queryContainer = document.getElementById("queryFields")

let db = firebase.firestore();
let artistDB = db.collection("artists");
let recordDB = db.collection("records");
let newArtistDB = db.collection("artistDB");
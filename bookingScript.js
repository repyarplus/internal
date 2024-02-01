if(document.cookie == '') {
  window.location.href = "https://jamil-test.glitch.me/login.html";
}

let idData = document.cookie.split(";");
let userId = idData[0].split("=")[1];
let userFName = idData[1].split("=")[1];
let userLName = idData[2].split("=")[1];
let userType = idData[3].split("=")[1];
let newBookCard = document.getElementById("newBookCard");
let newBookIcon = document.getElementById("newBooking");
let bookingStatusDiv = document.getElementById("bookingStatus");//booking status form
let bookingsDiv = document.getElementById("cards-container");

//New Booking Form Start

const scriptURL = "https://script.google.com/macros/s/AKfycbzAK0ox3FsbPHR3lmtipjsnanUGnlKEqOkrXUNe6Vl4R4Ui3w0q0zuQaBRqHA1h7Kb74g/exec";
const form = document.forms["Service-Bookings"];

form.addEventListener("submit", (e) => {
	e.preventDefault();
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
		.then((response) => {
			console.log("Success!", response);
            // Additional function call after the fetch is successful
			newBookCard.style.display = "none";
      bookingPreview();
		})
        .catch((error) => {
			console.error("Error!", error.message);
			// Additional function call if there's an error with the fetch
        });
});

function preFilledForm() {
	let formBN = document.getElementById("bookingNumber");
	let formDAT = document.getElementById("dateAndTime");
	let formMonth = document.getElementById("month");
	let currentTime = new Date();
	
	document.getElementById("userId").value = userId;
	document.getElementById("userName").value = userFName;
	formMonth.value = currentTime.getMonth() + 1;
	formDAT.value = currentTime.toDateString() + " " + currentTime.toTimeString().slice(0, 8);
	
formBN.value = '=VALUE(CONCATENATE(RIGHT(YEAR(INDIRECT("E" & ROW())),2), TEXT(MONTH(INDIRECT("E" & ROW())), "00"), TEXT(COUNTIF(INDIRECT("O1:O" & ROW()), INDIRECT("O" & ROW())), "00")))';
}

function bookingPreview() {
	let formData = new FormData(form);
	document.getElementById("modalName").innerHTML = formData.get("name");
	
	document.getElementById("modalDetails").innerHTML = "Phone Numbers: " + formData.get("phoneNumber")
	+ ", " + formData.get("altNumber") + "<br>"
	+ "Email: " + formData.get("email") + "<br>"
	+ "Address: " + formData.get("address") + "<br>"
	+ "Pincode: " + formData.get("pincode") + "<br>"
	+ "Vehicle: " + formData.get("vehicle") + " " + formData.get("model") + "<br>"
	+ "Issue: " + formData.get("issue") + "<br>"
	+ "Appointment On " + formData.get("appointmentDateAndTime");
	
	document.getElementById("bookingModal").style.display = "block";	
}

function modalWA() {
    let formData = new FormData(form);
    let message = `*Name:* ${formData.get("name")}
*Phone Numbers:* ${formData.get("phoneNumber")}, ${formData.get("altNumber")}
*Address:* ${formData.get("address")}
*Vehicle:* ${formData.get("vehicle")} ${formData.get("model")}
*Issue:* ${formData.get("issue")}
*Appointment:* ${formData.get("appointmentDateAndTime")}`;

    // Construct WhatsApp link
    let waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Redirect to WhatsApp
    window.location.href = waLink;
}

function modalClose() {
	document.getElementById("bookingModal").style.display = "none";
  newBookIcon.style.display = "block";
  document.forms["Service-Bookings"].reset();
  bookingsDiv.style.display = "block";
}

function newBooking() {
  preFilledForm();
  newBookCard.style.display = "block";
  newBookIcon.style.display = "none";
  bookingsDiv.style.display = "none";
}

// End of New Bookings

//Incomplete Booking Starts
let myData;
 fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRilpgg9SMxdf64sZqm5n2bd8czDHseC2bQAkvfaHRw46wX8hC00Ys_ihBNvNZC8-_pH9oaCmr5cKMk/pub?gid=178526086&single=true&output=csv')
            .then(response => response.text())
            .then(csv => {
                // Convert CSV to array of objects
               
   const rows = csv.split('\n');
                const headers = rows[0].split(',');
                const data = rows.slice(1).map(row => {
                    const values = row.split(',');
                    const entry = {};
                    headers.forEach((header, index) => {
                        entry[header.trim()] = values[index].trim();
                    });
                    return entry;
                });
                // Create HTML cards from the data
                const cardsContainer = document.getElementById('cards-container');
                data.forEach(entry => {
                    const card = document.createElement('div');
                  card.id = entry['Booking Number'];
                    card.classList.add('card');
                  
                    card.innerHTML = `
                    <nav style="display: none"><ul><li onclick="jobDetails(this)">Booking Details</li><li onclick="jobStatus(this)">Job Updates</li><li onclick="closeCard(this)">Close</li></ul></nav>
                        <div onclick="cardBodyClick(this)" style="margin-top: 5px;">
                        ${entry['Booking Number']} <Strong style="margin-left: 50%;">Status</strong><br>     
                        <i>Booked on: ${entry['Booking Date']}</i><br>
                        <i></i><br><hr>
                        <strong>Name:</strong> ${entry['Name']}<br>
                        <strong>Appointment:</strong> ${entry['Appointment Date']}<br>
                        </div>
                        <div style="display: none;">
                        <strong>Phone Numbers:</strong> ${entry['Phone Number']} / ${entry['Alt Number']}<br>
                        <strong>Email:</strong> ${entry['Email']}<br>
                        <strong>Address:</strong> ${entry['Address']}<br>
                        <strong>Pincode:</strong> ${entry['Pincode']}<br>
                        <strong>Vehicle:</strong> ${entry['Vehicle']} ${entry['Model']}<br>
                        <strong>Vehicle Number and Kilometer</strong> <br>
                        <strong>Issue:</strong> ${entry['Issue']}<br>
                        <strong>Mechanics</strong>
                        <div>Completed Date and Charges</div>
                        <div>Services</div>
                        </div>
                        <div style="display: none">Job Updates</div>
                        <div style="display: flex;">
                          <button style="display: none" onclick="cancelJob(this)">Cancel</button>
                          <button style="display: none" onclick="acceptJob(this)">Accept</button>
                          <button style="display: none" onclick="joinJob(this)">Join</button>
                          <button style="display: none" onclick="startJob(this)">Start Job</button>
                          <button style="display: none" onclick="doneJob(this)">Job Done</button>
                          <button style="display: none" onclick="completeJob(this)">Complete</button>
                        </div>
                    `;
                    cardsContainer.appendChild(card);
                });
   bookingStatus();
   
            });

function bookingStatus() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRilpgg9SMxdf64sZqm5n2bd8czDHseC2bQAkvfaHRw46wX8hC00Ys_ihBNvNZC8-_pH9oaCmr5cKMk/pub?gid=923930940&single=true&output=csv')
        .then(response => response.text())
        .then(sCsv => {
            // Convert CSV to array of objects
            const sRows = sCsv.split('\n');
            const sHeaders = sRows[0].split(',');
            const sData = sRows.slice(1).map(row => {
                const values = row.split(',');
                const entry = {};
                sHeaders.forEach((header, index) => {
                    entry[header.trim()] = values[index].trim();
                });
                return entry;
            });
            // Your code to process sData here
    
       sData.forEach(entry => {
         let sCard = document.getElementById(entry['Booking Number']);
         
         //status update
        sCard.children[1].children[0].innerHTML = entry['Status'] === '' ? 'New Booking' : entry['Status'];
         
         //estimated date
         if(entry['Estimated Completed Time'] != '') {
           sCard.children[1].children[4].innerHTML = `Estimated Time: ${entry['Estimated Completed Time']}`;
         }
         
         // vehicle number
         if(entry['Vehicle Number'] != '') {
           sCard.children[2].children[10].innerHTML = `Vehicle Number: ${entry['Vehicle Number'].toUpperCase()}, ${entry['Kilometer']} Kilometer`;
         }
         // mechanics
         let mechanics = entry['Mechanics'].split('#');
         let displayMechanics = '';
         mechanics.forEach(function (item) {
           displayMechanics += `${item} `;
         });
         sCard.children[2].children[14].innerHTML = "<hr>" + displayMechanics;
         
         //Job Updates
         let remarks = entry['Remarks'].split('#');
         let displayRemarks = '';
         if(userType == 'Admin') {
           let locations = entry['Locations'].split('#');
           for(let i = 0; i < remarks.length; i++) {
             displayRemarks += `<div><i>${remarks[i]} </i><a href="${locations[i]}">Location</a> </div>`;
           }
         }
         else {
           for(let i = 0; i < remarks.length; i++) {
             displayRemarks += `<div><i>${remarks[i]}</i></div>`;
           }
         }
         sCard.children[3].innerHTML = displayRemarks;
         // completed informations
         if(entry['Completed Date And Time'] != '') {
           sCard.children[2].children[15].innerHTML = `Job Completed On: ${entry['Completed Date And Time']} <br>
           Charge: ${entry['Charge']} Rupees`;
           sCard.children[2].children[16].innerHTML = `<strong>Services: </strong> ${entry['Services']}`;
         }
        })
    })
        .catch(error => {
            console.error('Error fetching CSV:', error);
        });
}

function closeCard(button) {
  let card = button.closest('.card');
  card.children[0].style.display = "none";
  card.children[1].style.display = "block";
  card.children[2].style.display = "none";
  card.children[3].style.display = "none";
  card.children[4].style.display = "none";
}

function openCard(button) {
  let card = button.closest('.card');
  card.children[0].style.display = "block";
  card.children[1].style.display = "block";
  card.children[2].style.display = "block";
  card.children[4].style.display = "flex";
}

function jobStatus(button) {
  let card = button.closest('.card');
  card.children[0].style.display = "block";
  card.children[1].style.display = "none";
  card.children[2].style.display = "none";
  card.children[3].style.display = "block";
  card.children[4].style.display = "flex";
}

function jobDetails(button) {
  let card = button.closest('.card');
  card.children[0].style.display = "block";
  card.children[1].style.display = "block";
  card.children[2].style.display = "block";
  card.children[3].style.display = "none";
  card.children[4].style.display = "flex";
}
function cardBodyClick(button){
  cardButton(button);
  openCard(button);
}

function cardButton(button) {
  let card = button.closest('.card');
  let cardStatus = card.children[1].children[0].innerHTML;
  myData = cardStatus;
  if(cardStatus == 'New Booking') {
    card.children[4].children[0].style.display = "block"; // Cancel
    card.children[4].children[1].style.display = "block"; // Accept
  }
  else if(cardStatus == 'Accepted') {
    card.children[4].children[2].style.display = "block"; // Join
    card.children[4].children[3].style.display = "block"; // Job start
  }
  else if(cardStatus == 'Working') {
    card.children[4].children[4].style.display = "block"; // Job Done
  }
  else if(userType == 'Admin') {
    card.children[4].children[5].style.display = "block"; // Complete
  }
  
}

// Booking Status All Time Functions
let bookingStatusForm = document.getElementById("bookingStatus").children[1].children[0].children;
function bookingStatusAllTime(button) {
  let card = button.closest('.card'); // Current card
  bookingStatusForm[1].value = card.id; //booking Number
  bookingStatusForm[2].value = userFName;
  bookingStatusForm[3].value = userId;
  bookingStatusForm[4].value = getCurrentDateTime(); //Current Date and Time
  //location
  getCurrentLocation(function(link) {
        if (link) {
            // Update the value of the input field with the Google Maps link
            bookingStatusForm[5].value = link;
        } else {
            // Handle error
            bookingStatusForm[5].value = '#';
        }
  });
  
  
  
  bookingsDiv.style.display = "none";
  bookingStatusDiv.style.display = "block";
}

// Click Join
function clickJoin() {
  bookingStatusForm[6].value = `${userFName} has joined: ${getCurrentDateTime()}`;
  bookingStatusForm[7].value = '';
  bookingStatusForm[8].style.display = "none";
  bookingStatusForm[9].style.display = "none";
  bookingStatusForm[10].style.display = "none";
  bookingStatusForm[11].style.display = "none";
  bookingStatusForm[12].style.display = "none";
}

function joinJob(button) {
  bookingStatusAllTime(button);
  clickJoin();
}

//click cancel

function clickCancel() {
  bookingStatusForm[6].value = `${userFName} has cancelled: ${getCurrentDateTime()}`;
  bookingStatusForm[7].value = 'Cancelled';
  bookingStatusForm[8].style.display = "none";
  bookingStatusForm[9].style.display = "none";
  bookingStatusForm[10].style.display = "none";
  bookingStatusForm[11].style.display = "none";
  bookingStatusForm[12].style.display = "none";
  
}
function cancelJob(button) {
  bookingStatusAllTime(button);
  clickCancel();
}

// click accept
function clickAccept() {
  bookingStatusForm[6].value = `${userFName} has accepted: ${getCurrentDateTime()}`;
  bookingStatusForm[7].value = 'Accepted';
  bookingStatusForm[8].style.display = "none";
  bookingStatusForm[9].style.display = "none";
  bookingStatusForm[10].style.display = "none";
  bookingStatusForm[11].style.display = "none";
  bookingStatusForm[12].style.display = "none";
}
function acceptJob(button) {
  bookingStatusAllTime(button);
  clickAccept();
}

// click job start
function clickJobStart() {
  bookingStatusForm[6].value = `The job is started: ${getCurrentDateTime()}`;
  bookingStatusForm[7].value = 'Working';
  bookingStatusForm[8].style.display = "block";
  bookingStatusForm[9].style.display = "block";
  bookingStatusForm[10].style.display = "none";
  bookingStatusForm[11].style.display = "none";
  bookingStatusForm[12].style.display = "block";
}
function startJob(button) {
  bookingStatusAllTime(button);
  clickJobStart();
}

//click job done
function clickJobDone() {
  bookingStatusForm[6].value = `The Job has Completed: ${getCurrentDateTime()}`;
  bookingStatusForm[7].value = 'Job Done';
  bookingStatusForm[8].style.display = "none";
  bookingStatusForm[9].style.display = "none";
  bookingStatusForm[10].style.display = "block";
  bookingStatusForm[11].style.display = "block";
  bookingStatusForm[12].style.display = "none";
}
function doneJob(button) {
  bookingStatusAllTime(button);
  clickJobDone();
}

//click complete
function clickComplete() {
  bookingStatusForm[6].value = `${userFName} has reviewed: ${getCurrentDateTime()}`;
  bookingStatusForm[7].value = 'Completed';
  bookingStatusForm[8].style.display = "none";
  bookingStatusForm[9].style.display = "none";
  bookingStatusForm[10].style.display = "none";
  bookingStatusForm[11].style.display = "none";
  bookingStatusForm[12].style.display = "none";
}
function completeJob(button) {
  bookingStatusAllTime(button);
  clickComplete();
}
// Get GPS Location

function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Construct Google Maps link
                const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                
                // Pass the link to the callback function
                callback(googleMapsLink);
            },
            function(error) {
                console.error('Error getting location:', error.message);
                // Pass null or any other value to indicate error
                callback(null);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        // Pass null or any other value to indicate error
        callback(null);
    }
}

// Booking Status form data
const statusForm = document.forms[1];

statusForm.addEventListener("submit", (e) => {
	e.preventDefault();
    fetch(scriptURL, { method: "POST", body: new FormData(statusForm) })
		.then((response) => {
			console.log("Success!", response);
            // Additional function call after the fetch is successful
      document.forms[1].reset();
	bookingsDiv.style.display = "block";
  bookingStatusDiv.style.display = "none";
		})
        .catch((error) => {
			console.error("Error!", error.message);
			// Additional function call if there's an error with the fetch
        });
});

// get current date and time
function getCurrentDateTime() {
    const currentDateTime = new Date();

    // Format options for the desired output
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    // Convert to human-readable format
    const formattedDateTime = currentDateTime.toLocaleString(undefined, options);

    console.log("Human Readable Date and Time:", formattedDateTime);
  return formattedDateTime;
}
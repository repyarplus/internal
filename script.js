const scriptURL =
  "https://script.google.com/macros/s/AKfycbzfDlVAerpHxmF7U5F-JQY96s7PLi1wuv3c0iPkIZ_mEuGBEcTDcIin40lG2FqdhIQe/exec";
const form = document.forms["submit-to-google-sheet"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      console.log("Success!", response);
      // Additional function call after the fetch is successful
      enterOTP();
    })
    .catch((error) => {
      console.error("Error!", error.message);
      // Additional function call if there's an error with the fetch
    });
});

let cod = Math.floor(100000 + Math.random() * 900000);
document.getElementById("cod").value = cod;

function enterOTP() {
  document.getElementById("getOTP").style.display = "none";
  document.getElementById("logCard").style.display = "block";
}

function logIn() {
  let enteredEmail = document.getElementById("inputEmail").value;
  let enteredCode = document.getElementById("logCode").value;
  if (cod == enteredCode) {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRj7o_c6fBa2ozcZ2Z7B8R4XAf412FYSTys6WvlV8OmPGld_6Kz3-J52FbgokiCimXQ14XnYNQv8OBE/pub?gid=0&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((data) => {
        // Parse CSV data
        const parsedData = Papa.parse(data, { header: false }).data;

        // Check if the entered email exists in the Google Sheet
        var matchingUser = parsedData.find((user) => user[3] === enteredEmail);

        if (matchingUser) {
          // If email matches, set cookies with user information
          var userId = matchingUser[0];
          var firstName = matchingUser[1];
          var lastName = matchingUser[2];
          var userType = matchingUser[4];

          // Consider using more secure methods for user identification
          document.cookie = "userId=" + userId;
          document.cookie = "firstName=" + firstName;
          document.cookie = "lastName=" + lastName;
          document.cookie = "userType=" + userType;

          console.log("Login successful. Cookies set.");

          // Redirect after cookies are set
          window.location.href = "https://jamil-test.glitch.me/index.html";
        } else {
          alert("Invalid email. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data from Google Sheet:", error);
      });
  } else {
    alert("Wrong OTP");
  }
}

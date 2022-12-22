const logIn = document.querySelector(".logIn");
const signUp = document.querySelector(".signUp");
const logOut = document.querySelector(".logOut");
const profile = document.querySelector(".profile");

if (sessionStorage.getItem("user_id") !== null) {
  logIn.style.display = "none";
  signUp.style.display = "none";
  logOut.style.display = "block";
  profile.style.display = "block";
}

logOut.addEventListener("click", () => {
  sessionStorage.clear();
  console.log("Shemovida");
  location.href = "index.html";
  console.log("shemovidameored");
  logIn.style.display = "block";
  signUp.style.display = "block";
  logOut.style.display = "none";
  profile.style.display = "none";
});

profile.addEventListener("click", () => {
  logIn.style.display = "none";
  signUp.style.display = "none";
  logOut.style.display = "block";
  profile.style.display = "block";
});

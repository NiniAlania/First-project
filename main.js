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
  location.href = "index.html";
  logIn.style.display = "block";
  signUp.style.display = "block";
  logOut.style.display = "none";
  profile.style.display = "none";
  console.log(location.href);
  console.log("nini");
});

if (sessionStorage.getItem("user_role") === "host") {
  location.href = "host.html";
}

profile.addEventListener("click", () => {
  logIn.style.display = "none";
  signUp.style.display = "none";
  logOut.style.display = "block";
  profile.style.display = "block";
});

const firstName = document.querySelector("#firstName-prof");
const lastName = document.querySelector("#lastName-prof");
const email = document.querySelector("#email-prof");
const password = document.querySelector("#password-prof");
const profileIcon = document.querySelector(".profile");
const edit = document.querySelector("#edit");
const submit = document.querySelector("#submit");

setInformation();

function setInformation() {
  const id = sessionStorage.getItem("user_id");

  getElementFromFirebase("User", id).then((user) => {
    console.log(user.data);
    firstName.value = user.data.name;
    firstName.disabled = true;
    lastName.value = user.data.lastName;
    lastName.disabled = true;
    email.value = user.data.email;
    email.disabled = true;
    password.value = user.data.password;
    password.disabled = true;
  });
}

edit.addEventListener("click", () => {
  firstName.disabled = false;
  lastName.disabled = false;
  email.disabled = false;
  password.disabled = false;
});

function newInfo() {
  updateFirebase("User", {
    name: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  });
}
submit.addEventListener("click", () => {
  newInfo();
  firstName.disabled = true;
  lastName.disabled = true;
  email.disabled = true;
  password.disabled = true;
});

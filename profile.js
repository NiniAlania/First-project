const firstName = document.querySelector("#firstName-prof");
const lastName = document.querySelector("#lastName-prof");
const email = document.querySelector("#email-prof");
const password = document.querySelector("#password-prof");
const profileIcon = document.querySelector(".profile");
const edit = document.querySelector("#edit");
const submit = document.querySelector("#submit");

async function setInformation() {
  const id = sessionStorage.getItem("user_id");

  const user = await getElementFromFirebase("User", id);
  firstName.value = user.data.name;
  firstName.disabled = true;
  lastName.value = user.data.lastName;
  lastName.disabled = true;
  email.value = user.data.email;
  email.disabled = true;
  password.value = user.data.password;
  password.disabled = true;
}

edit.addEventListener("click", () => {
  firstName.disabled = false;
  lastName.disabled = false;
  email.disabled = false;
  password.disabled = false;
});

async function newInfo() {
  const userId = sessionStorage.getItem("user_id");
  await updateFirebase("User", userId, {
    name: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  });
}

submit.addEventListener("click", async () => {
  await newInfo();
  firstName.disabled = true;
  lastName.disabled = true;
  email.disabled = true;
  password.disabled = true;
});

(async () => {
  await setInformation();
})();

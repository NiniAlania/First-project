let logIn = document.querySelector(".logIn");
const signUp = document.querySelector(".signUp");
const register = document.querySelector(".register");
const signIn = document.querySelector(".signIn");
const changePasswordVisibility = document.querySelector(
  "#changePasswordVisibility"
);
const actionButton = document.querySelector("#actionButton");
const actionToggle = document.querySelectorAll(".toggle");
const name = document.querySelector("#name");
const lastName = document.querySelector("#lastName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const form = document.querySelector(".form");
const guest = document.querySelector(".guest");
const host = document.querySelector(".host");

const url = location.href;
const action = url.split("?").pop() || "register";

const isAction = action === "register";

if (action === "register") {
  toggle("register");
} else {
  toggle("auth");
}

register.addEventListener("click", () => {
  toggle("register");
});

logIn.addEventListener("click", () => {
  toggle("auth");
});

function toggle(action) {
  if (action === "auth") {
    signIn.classList.add("active");
    signUp.classList.remove("active");
    logIn.classList.add("active");
    register.classList.remove("active");
  } else {
    signIn.classList.remove("active");
    signUp.classList.add("active");
    logIn.classList.remove("active");
    register.classList.add("active");
  }

  actionButton.textContent = isAction ? "Sign up" : "Sing in";
}
actionToggle.forEach((element) => {
  element.style.display = isAction ? "block" : "none";
});

if (!isAction) {
  form.style.height = "350px";
}

const showPassword = '<i class="fa-regular fa-eye"></i>';
const hidePassword = '<i class="fa-solid fa-eye-low-vision"></i>';
let isShown = true;

changePasswordVisibility.addEventListener("click", () => {
  if (isShown) {
    changePasswordVisibility.innerHTML = hidePassword;
    password.type = "text";
  } else {
    changePasswordVisibility.innerHTML = showPassword;
    password.type = "password";
  }
  isShown = !isShown;
});

actionButton.addEventListener("click", () => {
  if (isAction) {
    actionRegister();
  } else {
    actionLogin();
  }
});

function actionRegister() {
  // let guest = guest.value;
  // let host = host.value;
  let userName = name.value;
  let userLastname = lastName.value;
  let userEmail = email.value;
  let userPassword = password.value;

  const usersArray = getRefFromFirebase("User");

  setTimeout(() => {
    let isUserUnique = usersArray.some((user) => user.data.email === userEmail);
    if (isUserUnique) {
      Swal.fire(
        "Failed! User with this Email address already exists",
        "please try another or sing in",
        "error"
      );
      return;
    }
    if (
      // (host === "" && guest === "") ||
      userName === "" ||
      userLastname === "" ||
      email === "" ||
      password === ""
    ) {
      Swal.fire("Failed!", "Please fill out all fields", "warning");
    } else {
      Swal.fire("congrats", "You have successfully registered!", "success");
      addElementInFirebase("User", {
        // user: host || guest,
        name: userName,
        lastName: userLastname,
        email: userEmail,
        password: userPassword,
      });
      actionButton.disabled = true;

      const usersArrayUpdated = getRefFromFirebase("User");

      setTimeout(() => {
        const userIndex = usersArrayUpdated.findIndex(
          (user) =>
            user.data.email === userEmail && user.data.password === userPassword
        );
        if (userIndex === -1) {
          Swal.fire("Failed!", "Wrong data", "error");
        } else {
          const id = usersArrayUpdated[userIndex].id;
          sessionStorage.setItem("user_id", id);
          location.href = "index.html";
        }
      }, 1000);
    }
  }, 1500);
}

function actionLogin() {
  let userEmail = email.value;
  let userPassword = password.value;

  const usersArrayUpdated = getRefFromFirebase("User");

  setTimeout(() => {
    const userIndex = usersArrayUpdated.findIndex((user) => {
      return (
        user.data.email === userEmail && user.data.password === userPassword
      );
    });
    if (userIndex === -1) {
      Swal.fire("Failed!", "Wrong data", "error");
    } else {
      Swal.fire("Welcome", "You have successfully authorised!", "success");
      const id = usersArrayUpdated[userIndex].id;
      sessionStorage.setItem("user_id", id);
      location.href = "index.html";
      logIn.classList.remove("active");
    }
  }, 1500);
}

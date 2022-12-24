const edit = document.querySelector("#edit");
const hName = document.querySelector("#hotelName");
const image = document.querySelector("#hotel-image");
const description = document.querySelector(".description");
const roomImage = document.querySelector("#room-image");
const roomDescription = document.querySelector("#room-description");
const addRoom = document.querySelector("#add-room");
const submit = document.querySelector("#submit");
const forCards = document.querySelector(".forCards");

function convertBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

submit.addEventListener("click", () => {
  hotelRegister();
  setHotelInformation();
});

addRoom.addEventListener("click", (event) => {
  roomRegister();
});

async function hotelRegister() {
  let hotelName = hName.value;
  let hotelDescription = description.value;
  let hotelImage = image.files[0];

  const hotelsArray = getRefFromFirebase("Hotel");

  setTimeout(async () => {
    let isHotelUnique = hotelsArray.some(
      (user) => user.data.hotelName === hotelName
    );

    if (isHotelUnique) {
      Swal.fire(
        "Failed! Hotel with this name already exists",
        "please try another name",
        "error"
      );
      return;
    }

    if (hotelName === "" || hotelDescription === "") {
      Swal.fire("Failed!", "Please fill out all fields", "warning");
    } else {
      Swal.fire(
        "congrats",
        "You have successfully registered your hotel!",
        "success"
      );
      const hotelBase64 = await convertBase64(hotelImage);
      const userID = sessionStorage.getItem("user_id");
      addElementInfirebaseWithId("Hotel", userID, {
        hotelName: hotelName,
        hotelDescription: description,
        hotelImageUrl: hotelBase64,
        rooms: [],
      });
      submit.disabled = true;
    }
  });
}

async function roomRegister() {
  let roomPhoto = roomImage.files[0];
  let roomDescription2 = roomDescription.value;

  setTimeout(async () => {
    if (roomPhoto.files > 0 || roomDescription2 === "") {
      Swal.fire("Failed!", "Please fill out all fields", "warning");
    } else {
      Swal.fire(
        "congrats",
        "You have successfully registered your hotel!",
        "success"
      );
      const roomBase64 = await convertBase64(roomPhoto);
      const userID = sessionStorage.getItem("user_id");
      const hotelDetails = getElementFromFirebase("Hotel", userID);
      let newDetails = hotelDetails.data.rooms;
      newDetails.push({
        roomID: randomID(),
        roomImage: roomBase64,
        roomDescription: roomDescription2,
      });
      updateFirebase("Hotel", newDetails);
      addRoom.disabled = true;
    }
  });
}

function setHotelInformation() {
  const id = sessionStorage.getItem("user_id");

  getElementFromFirebase("Hotel", id).then((hotel) => {
    hName.value = hotel.data.hotelName;
    hName.disabled = true;
    description.value = hotel.data.hotelDescription;
    description.disabled = true;
  });
}

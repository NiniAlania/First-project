const hotelName = document.querySelector("#yourHotel");
const hotelImage = document.querySelector(".yourHotelImage");
const hotelDescr = document.querySelector("#yourHotelDescription");
const roomPhoto = document.querySelector(".yourRoom");
const roomDescr = document.querySelector("#yourRoomDescription");
const calendar = document.querySelector("#calendar");
const submit = document.querySelector(".submit");
const edit = document.querySelector("#edit");
const uploadHotelImage = document.querySelector(".uploadHotelImage");
const uploadRoomImage = document.querySelector(".uploadRoom");
const url = location.href;
const roomId = url.split("roomID=").pop();
const hotelID = url.split("hotelID=").pop().split("&").shift();

async function drawHotelInfo() {
  const hotel = await getElementFromFirebase("Hotel", hotelID);

  if (hotel.data !== null) {
    hotelName.value = hotel.data.hotelName;
    hotelName.disabled = true;
    hotelDescr.value = hotel.data.hotelDescription;
    hotelDescr.disabled = true;
    uploadHotelImage.style.display = "none";
    const forImage = hotel.data.hotelImageUrl;
    hotelImage.innerHTML += `
    <div class="card" style="width: 18rem;">
      <img src="${forImage}" class="card-img-top">
    </div>
  `;
  }
}

async function drawRoomInfo() {
  const hotel = await getElementFromFirebase("Hotel", hotelID);

  if (hotel.data !== null && hotel.data.hasOwnProperty("rooms")) {
    hotel.data.rooms.forEach((room) => {
      if (room.roomID === roomId) {
        roomDescr.value = room.roomDescription;
        roomDescr.disabled = true;
        uploadRoomImage.style.display = "none";
        roomPhoto.innerHTML += `
      <div class="card" style="width: 18rem;">
        <img src="${room.roomImage}" class="card-img-top">
      </div>
    `;
      }
    });
  }
}

async function setCalendar() {
  const hotel = await getElementFromFirebase("Hotel", hotelID);
}

async function updateDate() {
  const id = sessionStorage.getItem("user_id");

  if (id === null) {
    Swal.fire("Failed!", "Please,  sign in", "error");
    location.href = "auth.html?auth";
  } else {
    const dates = getDates();

    const hotel = await getElementFromFirebase("Hotel", hotelID);
    console.log(hotel);

    const room = Object.values(hotel.data.rooms).find(
      (room) => room.roomID === roomId
    );
    if (!room.hasOwnProperty("Reservations")) {
      room["Reservations"] = [];
    }

    const reservation = room.Reservations.find(
      (reservation) => reservation.guestID === id
    );

    if (reservation === undefined) {
      room.Reservations.push({ guestID: id, reservedDates: dates });
    } else {
      reservation.reservedDates.push(...dates);
    }

    await updateFirebase("Hotel", hotelID, { rooms: hotel.data.rooms });
    Swal.fire(
      "Congrats",
      "You have successfully reserved the room!",
      "success"
    );
    await initCalendar();
  }
}

async function initCalendar() {
  const hotel = await getElementFromFirebase("Hotel", hotelID);

  const room = Object.values(hotel.data.rooms).find(
    (room) => room.roomID === roomId
  );
  console.log(hotel, room);
  const dates = [];

  if (!room.hasOwnProperty("Reservations")) {
    room["Reservations"] = [];
  }

  if (room.hasOwnProperty("Reservations")) {
    room.Reservations.forEach((reservation) => {
      dates.push(...reservation.reservedDates);
    });
  }

  setDates(dates);
}

const role = sessionStorage.getItem("user_role");

edit.addEventListener("click", async () => {
  if (role === "admin") {
    hotelName.disabled = false;
    hotelDescr.disabled = false;
    hotelImage.style.display = "none";
    uploadHotelImage.style.display = "block";
    roomDescr.disabled = false;
    roomPhoto.style.display = "none";
    uploadRoomImage.style.display = "block";
  }
});

submit.addEventListener("click", async () => {
  await updateInformation();
  await updateDate();
  hotelName.disabled = true;
  hotelDescr.disabled = true;
});

async function updateInformation() {
  const hotel = await getElementFromFirebase("Hotel", hotelID);
  console.log(hotel);
  const room = Object.values(hotel.data.rooms).find(
    (room) => room.roomID === roomId
  );
  if (
    hotelName.value === "" ||
    hotelDescr.value === "" ||
    roomDescr.value === ""
  ) {
    Swal.fire("Failed!", "Please fill out all fields", "warning");
  } else {
    hotel.data.hotelName = hotelName.value;
    hotel.data.hotelDescription = hotelDescr.value;
    if (uploadHotelImage.files.length > 0) {
      const file = uploadHotelImage.files[0];
      const url = await convertBase64(file);
      hotel.data.hotelImageUrl = url;
    }
    room.roomDescription = roomDescr.value;
    if (uploadRoomImage.files.length > 0) {
      const file = uploadRoomImage.files[0];
      const url = await convertBase64(file);
      room.roomImage = url;
    }
    await updateFirebase("Hotel", hotelID, hotel.data);
    await drawHotelInfo();
    await drawRoomInfo();
  }
}

(async () => {
  await drawHotelInfo();
  await drawRoomInfo();
  await initCalendar();
})();

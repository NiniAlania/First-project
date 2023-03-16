const hotelName = document.querySelector("#hotelName");
const hotelImage = document.querySelector("#hotelImage");
const hotelDescr = document.querySelector("#hotelDescr");
const roomImage = document.querySelector("#roomImage");
const roomDescr = document.querySelector("#roomDescr");
const reservation = document.querySelector("#calendar");
const submit = document.querySelector("#submit");

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
    const forImage = hotel.data.hotelImageUrl;
    hotelImage.innerHTML = `
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
        roomImage.innerHTML = `
      <div class="card" style="width: 18rem;">
        <img src="${room.roomImage}" class="card-img-top">
      </div>
    `;
      }
    });
  }
}

submit.addEventListener("click", async () => {
  const id = sessionStorage.getItem("user_id");
  const role = sessionStorage.getItem("user_role");

  if (id === null) {
    Swal.fire("Failed!", "Please,  sign in", "error");
    location.href = "auth.html?auth";
  } else if (id !== hotelID || role === "admin") {
    const selectedDates = getSelectedDates();
    const reservations = getReservations();

    const hotel = await getElementFromFirebase("Hotel", hotelID);

    const room = Object.values(hotel.data.rooms).find(
      (room) => room.roomID === roomId
    );
    if (!room.hasOwnProperty("Reservations")) {
      room["Reservations"] = [];
    }

    room.Reservations = reservations;
    selectedDates.forEach(date => room.Reservations.push({'date': date, 'userId': id}));

    await updateFirebase("Hotel", hotelID, { rooms: hotel.data.rooms });
    Swal.fire(
      "Congrats",
      "You have successfully reserved the room!",
      "success"
    );
    await initCalendar();
  }
});

async function initCalendar() {
  const userId = sessionStorage.getItem("user_id");
  const userRole = sessionStorage.getItem("user_role");
  const hotel = await getElementFromFirebase("Hotel", hotelID);

  const room = Object.values(hotel.data.rooms).find(
    (room) => room.roomID === roomId
  ); 

  if (room.hasOwnProperty("Reservations")) {
    setReservations(room.Reservations, userRole === "guest" ? userId : undefined);
  }
}

async function disableSubmit() {
  const userId = sessionStorage.getItem("user_id");
  const role = sessionStorage.getItem("user_role");

  if (userId !== hotelID && role === 'host') {
    submit.disabled = true;
    submit.style.display = "none";
  }
}

(async () => {
  await disableSubmit();
  await drawHotelInfo();
  await drawRoomInfo();
  await initCalendar();
})();

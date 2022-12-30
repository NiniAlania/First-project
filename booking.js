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
        roomImage.innerHTML += `
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
});

async function initCalendar() {
  const hotel = await getElementFromFirebase("Hotel", hotelID);
  console.log(hotel);

  const room = Object.values(hotel.data.rooms).find(
    (room) => room.roomID === roomId
  );
  console.log(room);

  const dates = [];

  if (room.hasOwnProperty("Reservations")) {
    room.Reservations.forEach((reservation) => {
      dates.push(...reservation.reservedDates);
    });
  }

  setDates(dates);
}

(async () => {
  await drawHotelInfo();
  await drawRoomInfo();
  await initCalendar();
})();

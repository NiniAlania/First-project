const container = document.querySelector(".hotels-top");
const seeMore = document.querySelector(".moreHotels");

let hotelsArray;

let index = 0;

async function addCarousel() {
  let result = "";

  for (let i = index; i < Math.min(index + 4, hotelsArray.length); i++) {
    const hotel = hotelsArray[i];
    const role = sessionStorage.getItem("user_role");
    let top = "";
    if (role === "admin") {
      top += `<div
    id="carouselExampleCaptions${i}"
    class="carousel slide"
    data-bs-ride="false"
  >
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img
          src="${hotel.data.hotelImageUrl}"
          class="d-block w-100 image"
          alt="..."
        />
        <div class="carousel-caption d-none d-md-block">
          <h5><a href="rooms.html?hotelID=${hotel.id}">Edit Details</a></h5>
        </div>
    </div>`;
    } else {
      top += `<div
    id="carouselExampleCaptions${i}"
    class="carousel slide"
    data-bs-ride="false"
  >
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img
          src="${hotel.data.hotelImageUrl}"
          class="d-block w-100 image"
          alt="..."
        />
        <div class="carousel-caption d-none d-md-block">
          <h5><a href="booking.html?hotelID=${hotel.id}">Book Now</a></h5>
        </div>
    </div>`;
    }

    let mid = "";

    Object.values(hotel.data.rooms).forEach((room) => {
      const role = sessionStorage.getItem("user_role");
      if (role === "admin") {
        mid += ` <div class="carousel-item">
              <img
                src="${room.roomImage}"
                  class="d-block w-100 image"
                  alt="..."
                />
              <div class="carousel-caption d-none d-md-block">
                <h5><a href="rooms.html?hotelID=${hotel.id}&roomID=${room.roomID}">Edit Details</a></h5>
              </div>
             </div>`;
      } else {
        mid += ` <div class="carousel-item">
              <img
                src="${room.roomImage}"
                  class="d-block w-100 image"
                  alt="..."
                />
              <div class="carousel-caption d-none d-md-block">
                <h5><a href="booking.html?hotelID=${hotel.id}&roomID=${room.roomID}">Book Now</a></h5>
              </div>
             </div>`;
      }
    });

    let bot = `<button
    class="carousel-control-prev"
    type="button"
    data-bs-target="#carouselExampleCaptions${i}"
    data-bs-slide="prev"
     >
    <span
      class="carousel-control-prev-icon"
      aria-hidden="true"
    ></span>
    <span class="visually-hidden">Previous</span>
    </button>
    <button
    class="carousel-control-next"
    type="button"
    data-bs-target="#carouselExampleCaptions${i}"
    data-bs-slide="next"
     >
    <span
      class="carousel-control-next-icon"
      aria-hidden="true"
    ></span>
     <span class="visually-hidden">Next</span>
     </button>
     </div>`;
    container.innerHTML += top + mid + bot;
  }
  index += 4;
}

seeMore.addEventListener("click", async () => {
  await addCarousel();
});

(async () => {
  hotelsArray = await getRefFromFirebase("Hotel");
  await addCarousel();
})();

const container = document.querySelector(".hotels-top");

async function addCard() {
  const hotelsArray = getRefFromFirebase("Hotel");

  setTimeout(() => {
    hotelsArray.every((hotel) => {
      container.innerHTML += `<div
      id="carouselExampleCaptions"
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
            <h5><a href="./auth.html">Book Now</a></h5>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="${hotel.data.rooms.roomImage}"
            class="d-block w-100 image"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5><a href="./auth.html">Book Now</a>/h5>
          </div>
        </div>
        <div class="carousel-item">
          <img
            src="https://media.radissonhotels.net/image/radisson-blu-iveria-hotel-tbilisi-city-centre/guest-room/16256-114261-f70788875_3xl.jpg?impolicy=Card"
            class="d-block w-100 image"
            alt="..."
          />
          <div class="carousel-caption d-none d-md-block">
            <h5><a href="./auth.html">Book Now</a></h5>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
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
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span
          class="carousel-control-next-icon"
          aria-hidden="true"
        ></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>`;
    });
  }, 1500);
}

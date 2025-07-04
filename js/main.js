const userVehicles = JSON.parse(localStorage.getItem("selfdrive_vehicles")) || [];
window.vehicles = [...(window.demoVehicles || []), ...userVehicles];

function applyFilters() {
  const location = document.getElementById("searchLocation").value.toLowerCase();
  const type = document.getElementById("vehicleType").value;
  const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;
  const sortOrder = document.getElementById("sortOrder").value;

  let results = vehicles.filter(vehicle => {
    const matchesLocation = vehicle.location.toLowerCase().includes(location);
    const matchesType = !type || vehicle.type.toLowerCase() === type.toLowerCase();
    const matchesPrice = vehicle.price >= minPrice && vehicle.price <= maxPrice;

    return matchesLocation && matchesType && matchesPrice;
  });

  // Apply sorting
  if (sortOrder === "low") {
    results.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high") {
    results.sort((a, b) => b.price - a.price);
  }

  renderVehicles(results);
}

function renderVehicles(list) {
  const container = document.getElementById("featuredContainer");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No vehicles found.</p>";
    return;
  }

  list.forEach(vehicle => {
    const card = `
      <div class="vehicle-card">
        <img src="${vehicle.images?.[0] || 'images/placeholder.jpg'}" alt="${vehicle.brand}" width="100%" />
        <h3>${vehicle.brand}</h3>
        <p>Type: ${vehicle.type}</p>
        <p>Location: ${vehicle.location}</p>
        <p>₹${vehicle.price}/day</p>
        <p>Available: ${vehicle.availableFrom} to ${vehicle.availableTo}</p>
        <a href="vehicle.html?id=${vehicle.id}" class="view-details-btn">View Details</a>
      </div>
    `;
    container.innerHTML += card;
  });
}

window.onload = () => {
  renderVehicles(vehicles);
};

    // Load vehicles
  function loadVehicles() {
  const data = JSON.parse(localStorage.getItem("selfdrive_vehicles"));
  return Array.isArray(data) ? data : [];
}


    // Render list of vehicles
    function renderList(vehicles) {
      const listContainer = document.getElementById("listContainer");
      listContainer.innerHTML = "";

      if (vehicles.length === 0) {
        listContainer.innerHTML = "<p>No vehicles found.</p>";
        return;
      }

      vehicles.forEach(v => {
        listContainer.innerHTML += `
          <div class="vehicle-card">
            <img src="${v.images?.[0] || v.image || 'images/placeholder.jpg'}" alt="${v.brand}" width="100%" />
            <h3>${v.brand}</h3>
            <p>${v.type} - ₹${v.price}/day</p>
            <p>${v.location}</p>
            <a href="vehicle.html?id=${v.id}" class="view-details-btn">View Details</a>
          </div>
        `;
      });
    }

    // Apply filters
    function applyFilters() {
      const location = document.getElementById("searchLocation").value.toLowerCase();
      const type = document.getElementById("vehicleType").value;
      const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
      const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;
      const sortOrder = document.getElementById("sortOrder").value;

      let vehicles = loadVehicles().filter(v =>
        v.location.toLowerCase().includes(location) &&
        (!type || v.type.toLowerCase() === type.toLowerCase()) &&
        v.price >= minPrice && v.price <= maxPrice
      );

      if (sortOrder === "low") {
        vehicles.sort((a, b) => a.price - b.price);
      } else if (sortOrder === "high") {
        vehicles.sort((a, b) => b.price - a.price);
      }

      renderList(vehicles);
    }

    window.onload = () => {
      renderList(loadVehicles()); // shows all user vehicle

      const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
      const userNav = document.getElementById("userNav");

      if (user) {
        userNav.innerHTML = `
          <span>Welcome, ${user.name}</span>
          <a href="#" onclick="logout()">Logout</a>
        `;
      } else {
        userNav.innerHTML = `
          <a href="login.html">Login</a>
          <a href="register.html">Register</a>
        `;
      }
    };

    function logout() {
      sessionStorage.removeItem("loggedInUser");
      alert("You have been logged out.");
      window.location.href = "login.html";
    }

        // Add vehicle
    document.getElementById("vehicleForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (!user || user.role !== "lister") {
    alert("Only logged-in vehicle owners can list vehicles.");
    return;
  }

  const fileInput = document.getElementById("imageFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const vehicles = loadVehicles();
    const newVehicle = {
      id: Date.now(),
      brand: document.getElementById("brand").value,
      type: document.getElementById("type").value,
      location: document.getElementById("location").value,
      price: parseInt(document.getElementById("price").value),
      availableFrom: document.getElementById("availableFrom").value,
      availableTo: document.getElementById("availableTo").value,
      images: [reader.result], // Base64 string
      listerEmail: user.email,
      listerName: user.name
    };

    vehicles.push(newVehicle);
    localStorage.setItem("selfdrive_vehicles", JSON.stringify(vehicles));
    renderList(vehicles);
    document.getElementById("vehicleForm").reset();
    document.getElementById("formMsg").textContent = "Vehicle listed successfully!";
    setTimeout(() => document.getElementById("formMsg").textContent = "", 3000);
  };

  reader.readAsDataURL(file); // Convert file to Base64
});
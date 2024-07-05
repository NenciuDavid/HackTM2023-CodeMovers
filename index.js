let map;

async function initMap() {
    // The location of Timisoara
    const position = { lat: 45.7494, lng: 21.2272 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");
  
    var myStyles = [
        {
          featureType: "transit.station.bus",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station.rail",
          stylers: [{ visibility: "off"}],
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ];
    
    function getUserLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              const userPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
    
              resolve(userPosition);
            },
            function (error) {
              reject("Error getting user's location: " + error.message);
            }, 
          );
        } else {
          reject("Geolocation is not supported by this browser.");
        }
      });
    }

    let userPosition;
  try {
    userPosition = await getUserLocation();
  } catch (error) {
    console.error(error);
    // Handle error getting user's location
    // For example, you could set a default position or display an error message
    userPosition = { lat: 45.7494, lng: 21.2272 }; // Default position (Timisoara)
  }

  // The map, centered at the user's position
// The map, centered at Timisoara
  map = new Map(document.getElementById("map"), {
    zoom: 19,
    minZoom: 13,
    maxZoom: 25,
    center: userPosition,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: myStyles,
    disableDefaultUI: true,
    zoomControl: true,
    showUserLocation: true, // Enable the browser's default user location marker
  });

  // Create a blue marker symbol
  const blueMarkerSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
  };

  // Create an info window
  const infoWindow = new google.maps.InfoWindow({
    content:"Locatia curenta"
  });

  // Create a marker for the user's position
  const userMarker = new google.maps.Marker({
    position: userPosition,
    map: map,
    icon: blueMarkerSymbol,
  });

  // Open the info window initially
  infoWindow.open(map, userMarker);

  // Close the info window when the close button is clicked
  infoWindow.addListener("closeclick", function() {
    infoWindow.close();
  });

  // Reopen the info window when the marker is clicked
  userMarker.addListener("click", function() {
    infoWindow.open(map, userMarker);
  });

  // Close the info window when the map is clicked
  map.addListener("click", function() {
    infoWindow.close();
  });


  // Update the user's position marker as they move
  function updateUserPosition(position) {
    const userPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    userMarker.setPosition(userPosition);
  }

  // Start watching the user's position
  const watchID = navigator.geolocation.watchPosition(
    updateUserPosition,
    function (error) {
      console.error("Error getting user's location: " + error.message);
    }
  );

  //icoane

  var icoanaMarkerGaraj = {
      url: "Icoane/Icoana_garaj/garaj.svg",
      scaledSize: new google.maps.Size(40, 90),
      anchor: new google.maps.Point(20, 45)
    };

  var icoanaMarkerStatie = {
      url: "Icoane/Icoana_statie/statie.svg",
      scaledSize: new google.maps.Size(40, 90),
      anchor: new google.maps.Point(20, 45)
    };

  var icoanaMarkerBus = {
    url: "Icoane/bus.svg",
    scaledSize: new google.maps.Size(40, 90),
    anchor: new google.maps.Point(20, 45)
  }; 

  const apiUrl = 'https://tranzittm.coderdojogiroc.ro/request_stations.php';

  async function fetchStatii() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.map(statie => [statie.nume, parseFloat(statie.latitudine), parseFloat(statie.longitudine)]);
    } catch (error) {
      throw new Error('Eroare la efectuarea cererii: ' + error.message);
    }
  }

  const Statii = await fetchStatii();

  const markeriStatii = [];

  var markerGaraj = new google.maps.Marker({
      position: { lat: 45.70049002, lng: 21.23275932 },
      map: map,
      icon: icoanaMarkerGaraj
  });

  var markerBus = new google.maps.Marker({
    map: map,
    icon: icoanaMarkerBus
  });
  
  function updateMarkerPosition() {
    fetch('/request_buspos.php?busid=1')
      .then(response => response.json())
      .then(data => {
        var newLat = parseFloat(data.lat);
        var newLng = parseFloat(data.lon);
  
        markerBus.setPosition({ lat: newLat, lng: newLng });
      })
      .catch(error => {
        console.error('Eroare la actualizarea poziției markerului:', error);
      });
  }
  
  setInterval(updateMarkerPosition, 1000);  


  for (let i = 0; i < Statii.length; i++) {
    const Statie = Statii[i];

    const marker = new google.maps.Marker({
      position: { lat: Statie[1], lng: Statie[2] },
      map,
      icon: icoanaMarkerStatie,
    });

    // Attach click event listener to the marker
    marker.addListener("click", function() {
      updateStationModalContent(Statie[0]);
      stationModal.style.display = "block"; // Display the station modal
    });

    markeriStatii.push(marker);
  }

  function updateStationModalContent(stationName) {
    const stationModalContent = document.querySelector("#stationModal .modal-content");
  
    // Fetch liniile din API
    fetch(`/request_linii.php?name=${encodeURIComponent(stationName)}`)
      .then(response => response.json())
      .then(data => {
        const linii = data.nume; // Linia corespunzătoare numele stației
        stationModalContent.innerHTML = `
          <h2><center>${stationName}</center></h2>
          <h2><center>Linii:</center></h2>
          <button class="route-button">${linii}</button>
          <span class="close">&times;</span>
        `;
  
        // Restul codului pentru gestionarea evenimentelor și afișarea modalului
        const liniiButton = stationModalContent.querySelector(".route-button");
        liniiButton.addEventListener("click", function() {
          // Center the map on the bus marker
          map.setCenter(markerBus.getPosition());
          map.setZoom(19);
  
          // Close the station modal
          stationModal.style.display = "none";
        });
  
        const closeButton = stationModalContent.querySelector(".close");
        closeButton.addEventListener("click", function() {
          stationModal.style.display = "none";
        });
  
        stationModal.style.display = "block";
      })
      .catch(error => {
        console.error('Eroare la obținerea liniilor:', error);
      });
  }

  // Modify the loop where the station markers are created to attach a click event listener to each marker
  for (let i = 0; i < Statii.length; i++) {
    const Statie = Statii[i];

    const marker = new google.maps.Marker({
      position: { lat: Statie[1], lng: Statie[2] },
      map,
      icon: icoanaMarkerStatie,
    });

    // Attach click event listener to the marker
    marker.addListener("click", function() {
      updateStationModalContent(Statie[0]);
    });

    markeriStatii.push(marker);
  }

  const button = document.getElementById("myButton");

  // Get a reference to the modal element
  const modal = document.getElementById("myModal");


  // Function to execute when the button is clicked
  function handleButtonClick() {
    modal.style.display = "block";
    updateModalContent(userPosition);
  }

  // Add event listener to the button
  button.addEventListener("click", handleButtonClick);


  // Function to calculate the distance between two points using the Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  // Function to find the closest station to the user's position
  function findClosestStation(userPosition) {
    let closestStation = null;
    let minDistance = Infinity;

    for (let i = 0; i < Statii.length; i++) {
      const station = Statii[i];
      const distance = calculateDistance(
        userPosition.lat,
        userPosition.lng,
        station[1],
        station[2]
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestStation = station;
      }
    }

    return closestStation;
  }


  function updateModalContent(userPosition) {
    const closestStation = findClosestStation(userPosition);

    if (closestStation) {
      const modalContent = document.querySelector("#myModal .modal-content");
      modalContent.innerHTML = `
        <h2><center>Cea mai apropiata statie:</center></h2>
        <button class="station-button">${closestStation[0]}</button>
        <span class="close">&times;</span>
      `;

      // Add click event listener to the close button
      const closeButton = modalContent.querySelector(".close");
      closeButton.addEventListener("click", function() {
        modal.style.display = "none"; // Hide the modal
      });

      // Add click event listener to the station button
      const stationButton = modalContent.querySelector(".station-button");
      stationButton.addEventListener("click", function() {
        const stationCoordinates = {
          lat: closestStation[1],
          lng: closestStation[2]
        };

        // Center the map on the station coordinates
        map.setCenter(stationCoordinates);
        map.setZoom(19);

        // Hide the modal
        modal.style.display = "none";
      });
    }
  }

}
initMap();
let parkingData = [];
let filteredData = [];

fetch('parking-data.json')
    .then(response => {
        if(!response.ok) {
            throw new Erorr('Could not load parking data');
        }
        return response.json();
    })
    .then(data => {
        parkingData = data;
        filteredData = [...parkingData];
        displayParking(filteredData);
    })
    .catch(errorr => {
        console.error('Error loading parking data: ', error);
        alert('Error loading parking data. please make sure parking-data.json exists.');
    });

function searchParking() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    if (query) {
        filteredData = parkingData.filter(spot => 
            spot.name.toLowerCase().includes(query)
        );
    } else {
        filteredData = [...parkingData];
    }
    
    applyFilters();
}

function applyFilters() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const maxPrice = document.getElementById('maxPrice').value;

    filteredData = parkingData.filter(spot => {
        if (query && !spot.name.toLowerCase().includes(query)) return false;
        
        if (maxPrice && spot.price > maxPrice) return false;
        
        return true;
    });

    displayParking(filteredData);
}

function sortResults() {
    const sortValue = document.getElementById('sortSelect').value;
    
    switch(sortValue) {
        case 'price-low':
            filteredData.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredData.sort((a, b) => b.price - a.price);
            break;
    }
    
    displayParking(filteredData);
}

function displayParking(data) {
    const grid = document.getElementById('parkingGrid');
    const count = document.getElementById('resultsCount');
    
    count.textContent = `${data.length} parking spot${data.length !== 1 ? 's' : ''} found`;
    
    grid.innerHTML = data.map(spot => `
        <div class="parking-card">
            <div class="card-header">
                <h3>${spot.name}</h3>
            </div>
            <div class="card-info">
                <div class="price">$${spot.price}/hr</div>
                <div class="distance">
                    ${spot.distance} km
                </div>
            </div>
            <div calass="number">
                <p>${spot.number}</p>
            </div>
            <div class="availability ${spot.available > 5 ? 'available' : 'limited'}">
                ${spot.available} spots available
            </div>
            <button class="reserve-btn" onclick="reserveSpot(${spot.id}, '${spot.name}')">
                Reserve Now
            </button>
        </div>
    `).join('');
}

function getFeatureIcon(feature) {
    const icons = {
        'Covered': 'home',
        'EV Charging': 'charging-station',
        'Security': 'shield-alt'
    };
    return icons[feature] || 'check';
}

function reserveSpot(id, name) {
    const modal = document.getElementById('reservationModal');
    const message = document.getElementById('modalMessage');
    
    message.innerHTML = `Your spot at <strong>${name}</strong> has been reserved!<br>Check your email for confirmation details.`;
    
    modal.classList.add('active');
    console.log(`Reserved parking spot: ${id} - ${name}`);
}

function closeModal() {
    document.getElementById('reservationModal').classList.remove('active');
}
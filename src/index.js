// Fetch the films from the JSON server
fetch('http://localhost:3000/films')
  .then(response => response.json())
  .then(films => {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = ''; // Clear placeholder

    // Populate the films list
    films.forEach(film => {
      const li = document.createElement('li');
      li.className = 'film item';
      li.setAttribute('data-id', film.id);
      li.textContent = film.title;

      // Create a delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteFilm(film.id, li);
      li.appendChild(deleteButton);

      // Add 'sold-out' class if already sold out
      const remainingTickets = film.capacity - film.tickets_sold;
      if (remainingTickets === 0) {
        li.classList.add('sold-out');
      }

      filmsList.appendChild(li);

      // Add click event listener for each film item
      li.addEventListener('click', () => {
        displayMovieDetails(film);
      });
    });

    // Display the first movie's details
    if (films.length > 0) {
      displayMovieDetails(films[0]);
    }
  })
  .catch(error => console.error('Error fetching films:', error));

// Function to display movie details
function displayMovieDetails(movie) {
  const detailsDiv = document.getElementById('movie-details');
  const remainingTickets = movie.capacity - movie.tickets_sold;

  // Update the movie details section
  detailsDiv.innerHTML = `
    <img id="poster" src="${movie.poster}" alt="${movie.title}" />
  `;

  const detailsDiv2 = document.getElementById('showing');
  detailsDiv2.innerHTML = `
    <div class="card">
      <div id="title" class="title">${movie.title}</div>
      <div id="runtime" class="meta">${movie.runtime} minutes</div>
      <div class="content">
        <div class="description">
          <div id="film-info">${movie.description}</div>
          <span id="showtime" class="ui label">${movie.showtime}</span>
          <span id="ticket-num">${remainingTickets}</span> remaining tickets
        </div>
      </div>
      <div class="extra content">
        <button id="buy-ticket" class="ui orange button" ${remainingTickets > 0 ? '' : 'disabled'}>
          ${remainingTickets > 0 ? 'Buy Ticket' : 'Sold Out'}
        </button>
      </div>
    </div>
  `;

  // Add click event listener for the buy ticket button
  const buyTicketButton = document.getElementById('buy-ticket');
  buyTicketButton.addEventListener('click', () => {
    if (remainingTickets > 0) {
      // Update the remaining tickets
      const ticketNumSpan = document.getElementById('ticket-num');
      let currentTickets = parseInt(ticketNumSpan.textContent);
      currentTickets -= 1; // Decrease ticket count
      ticketNumSpan.textContent = currentTickets; // Update displayed count

      // Check if sold out
      if (currentTickets === 0) {
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = "Sold Out";
        // Add sold-out class to the film item
        const filmItem = document.querySelector(`li[data-id='${movie.id}']`);
        if (filmItem) {
          filmItem.classList.add('sold-out');
        }
      }

      // Update tickets_sold on the server
      fetch(`http://localhost:3000/films/${movie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tickets_sold: movie.tickets_sold + 1
        })
      })
      .catch(error => console.error('Error updating tickets sold:', error));
    }
  });
}

// Function to delete a film
function deleteFilm(id, li) {
    if (confirm("Are you sure you want to delete this movie?")) {
      fetch(`http://localhost:3000/films/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        li.remove(); // Remove the film from the list
      })
      .catch(error => console.error('Error deleting film:', error));
    }
  }
  

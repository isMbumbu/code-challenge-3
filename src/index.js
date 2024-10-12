// Fetch the films from the JSON server
fetch('http://localhost:3000/films')
  .then(response => response.json())
  .then(films => {
    const filmsList = document.getElementById('films');

    // Populate the films list
    films.forEach(film => {
      const li = document.createElement('li');
      li.className = 'film item';
      li.setAttribute('data-id', film.id);
      li.textContent = film.title;
      filmsList.appendChild(li);

      // Add click event listener for each film item
      li.addEventListener('click', () => {
        displayMovieDetails(film);
      });
    });
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

      // Update the button if sold out
      if (currentTickets === 0) {
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = "Sold Out";
      }
    }
  });
}


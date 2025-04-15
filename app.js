let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");
let count = 0;

async function fetchData() {
  if (button.innerHTML === "Fetch") {
    button.innerHTML = "Load More";
  }

  const response = await fetch(url);
  const data = await response.json();
  const pokemons = data.results;

  pokemons.map((pokemon) => {
    const li = document.createElement("li");
    const capitalizedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    li.innerHTML = `<h3>${capitalizedName}</h3>`;
    li.classList.add("hidden"); // Add hidden class initially
    container.appendChild(li);
  });

  observeElements(); // Observe new elements
  console.log(data.results);

  if (data.next && count < 2) {
    url = data.next;
    fetchData();
    count++;
    console.log(count);
  }else if(!data.next) {
    button.style.display = "none"; // Hide button if no more data
  } else {
    count = 0;
  }

  return data;
}

function observeElements() {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.classList.remove("hidden");
          observer.unobserve(entry.target); // Stop observing once visible})
      }
    });
  });

  // Observe all hidden list items
  document.querySelectorAll(".hidden").forEach((li) => observer.observe(li));
}

button.addEventListener("click", fetchData);

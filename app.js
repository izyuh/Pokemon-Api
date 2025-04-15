let url = "https://pokeapi.co/api/v2/pokemon/";
const container = document.getElementById("pokemon-list");
const button = document.getElementById("load");

const pokemonCountSpan = document.getElementById("pokemon-count");
let count = 0;
let pokemonCount = 0;

async function fetchData() {
  if (button.innerHTML === "Fetch") {
    button.innerHTML = "Load More";
  }

  const response = await fetch(url);
  const data = await response.json();
  const pokemons = data.results;
  console.log(pokemons);

  pokemons.map((pokemon) => {
    const a = document.createElement("a");
    a.href = pokemon.url;
    a.target = "_blank"; // Open in new tab
    const li = document.createElement("li");

    //sets name to h3
    const capitalizedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    li.innerHTML = `<h3>${capitalizedName}</h3>`;

    //adds picture 
    const img = document.createElement("img");
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonCount + 1}.png`;
    li.appendChild(img);

    //adds to list and makes hidden
    li.classList.add("hidden"); // Add hidden class initially
    a.appendChild(li);
    container.appendChild(a);
    pokemonCount++;
    pokemonCountSpan.innerHTML = `${pokemonCount}`;
  });

  observeElements(); // Observe new elements

  //fetches next 8 pokemon pages
  if (data.next && count < 9) {
    url = data.next;
    fetchData();
    count++;
  } else if(!data.next) { // if there is no more pages hide the button to fetch more
    button.style.display = "none"; 
  } else {// if the count is over 8, set the url to the next page anyway and then reset the count
    url = data.next;
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


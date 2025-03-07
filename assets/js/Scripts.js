let currentPage = 1;
let filters = {
    name: '',
    species: '',
    gender: '',
    status: ''
};

const container = document.getElementById("character-container");
const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

document.addEventListener("DOMContentLoaded", () => {
    const hoverSound = document.getElementById("hoverSound");
    hoverSound.volume = 0.3;
    getCharacters();
    document.getElementById('name').addEventListener('input', updateFilters);
    document.getElementById('species').addEventListener('change', updateFilters);
    document.getElementById('gender').addEventListener('change', updateFilters);
    document.getElementById('status').addEventListener('change', updateFilters);
});

async function getCharacters() {
    try {
        container.innerHTML = "Carregando...";
        const url = new URL('https://rickandmortyapi.com/api/character');
        url.searchParams.append('page', currentPage);

        for (let key in filters) {
            if (filters[key]) {
                url.searchParams.append(key, filters[key]);
            }
        }

        const response = await fetch(url);
        const data = await response.json();
        container.innerHTML = "";
        const sound = document.getElementById("hoverSound");

        data.results.forEach(character => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <p>${character.name}</p>
            `;
            
            card.addEventListener("mouseover", () => sound.play());
            card.addEventListener("click", () => {
                window.location.href = `./pages/detalhes.html?id=${character.id}`;
            });

            container.appendChild(card);
        });

        btnPrev.disabled = !data.info.prev;
        btnNext.disabled = !data.info.next;
    } catch (error) {
        console.log("Erro ao carregar personagens", error);
        container.innerHTML = "Erro ao carregar personagens";
    }
}

function updateFilters() {
    filters.name = document.getElementById('name').value;
    filters.species = document.getElementById('species').value;
    filters.gender = document.getElementById('gender').value;
    filters.status = document.getElementById('status').value;
    currentPage = 1;
    getCharacters();
}

btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        getCharacters();
    }
});

btnNext.addEventListener("click", () => {
    currentPage++;
    getCharacters();
});

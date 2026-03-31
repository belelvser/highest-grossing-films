const state = { allFilms: [], filtered: [] };

const grid = document.getElementById("filmGrid");
const stats = document.getElementById("stats");
const searchInput = document.getElementById("searchInput");
const countryFilter = document.getElementById("countryFilter");
const yearFilter = document.getElementById("yearFilter");
const sortSelect = document.getElementById("sortSelect");
const billionOnly = document.getElementById("billionOnly");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");

const filmModal = document.getElementById("filmModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const modalYear2 = document.getElementById("modalYear2");
const modalDirector = document.getElementById("modalDirector");
const modalRevenue = document.getElementById("modalRevenue");
const modalCountry = document.getElementById("modalCountry");

function normalizeText(value) {
  return (value ?? "").toString().trim();
}

function formatRevenue(value) {
  if (value == null || Number.isNaN(Number(value))) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function getPoster(film) {
  return normalizeText(film.poster_url);
}

function openModal(film) {
  const poster = getPoster(film);
  modalPoster.src = poster || "";
  modalPoster.alt = normalizeText(film.title) || "";
  modalPoster.style.display = poster ? "block" : "none";

  modalTitle.textContent = normalizeText(film.title) || "Untitled";
  modalYear.textContent = normalizeText(film.release_year) || "Unknown year";
  modalYear2.textContent = normalizeText(film.release_year) || "Unknown";
  modalDirector.textContent = normalizeText(film.director) || "Unknown";
  modalRevenue.textContent = formatRevenue(film.box_office);
  modalCountry.textContent = normalizeText(film.country) || "Unknown";

  filmModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  filmModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderStats(items) {
  const totalRevenue = items.reduce((sum, item) => sum + (Number(item.box_office) || 0), 0);
  const years = items.map(x => Number(x.release_year)).filter(x => !Number.isNaN(x));
  const minYear = years.length ? Math.min(...years) : "—";
  const maxYear = years.length ? Math.max(...years) : "—";

  stats.innerHTML = `
    <article class="stat">
      <div class="label">Visible films</div>
      <div class="value">${items.length}</div>
    </article>
    <article class="stat">
      <div class="label">Combined box office</div>
      <div class="value">${formatRevenue(totalRevenue)}</div>
    </article>
    <article class="stat">
      <div class="label">Year range</div>
      <div class="value">${minYear}–${maxYear}</div>
    </article>
    <article class="stat">
      <div class="label">Countries represented</div>
      <div class="value">${new Set(items.map(x => normalizeText(x.country)).filter(Boolean)).size}</div>
    </article>
  `;
}

function renderGrid(items) {
  if (!items.length) {
    grid.innerHTML = `<article class="stat" style="grid-column:1/-1"><div class="value" style="font-size:24px">No films found</div><div class="label">Try changing the filters.</div></article>`;
    renderStats(items);
    return;
  }

  grid.innerHTML = items.map((film, index) => {
    const title = normalizeText(film.title) || "Untitled";
    const year = normalizeText(film.release_year) || "Unknown";
    const poster = getPoster(film);

    return `
      <article class="card" data-index="${index}" tabindex="0" aria-label="${title}">
        <div class="card-media">
          ${poster ? `<img src="${poster}" alt="${title} poster" loading="lazy" />` : ``}
        </div>
        <div class="card-overlay"></div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <span class="card-year">${year}</span>
        </div>
      </article>
    `;
  }).join("");

  renderStats(items);

  [...grid.querySelectorAll(".card")].forEach((card, idx) => {
    const film = items[idx];
    card.addEventListener("click", () => openModal(film));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(film);
      }
    });
  });
}

function populateControls(films) {
  const countryTokens = new Set();
  films.forEach(film => {
    const text = normalizeText(film.country);
    if (!text) return;
    text.split(",").map(s => s.trim()).filter(Boolean).forEach(token => countryTokens.add(token));
  });

  [...countryTokens].sort((a, b) => a.localeCompare(b)).forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countryFilter.appendChild(option);
  });

  const years = [...new Set(
    films.map(f => Number(f.release_year)).filter(x => !Number.isNaN(x))
  )].sort((a, b) => a - b);

  years.forEach(year => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });
}

function applyFilters() {
  const q = searchInput.value.toLowerCase().trim();
  const countryValue = countryFilter.value;
  const yearValue = yearFilter.value;
  const onlyBig = billionOnly.checked;

  let items = [...state.allFilms].filter(film => {
    const haystack = `${normalizeText(film.title)} ${normalizeText(film.director)}`.toLowerCase();
    const okSearch = !q || haystack.includes(q);
    const okCountry = countryValue === "all" || normalizeText(film.country).toLowerCase().includes(countryValue.toLowerCase());
    const okYear = yearValue === "all" || Number(film.release_year) >= Number(yearValue);
    const okBig = !onlyBig || Number(film.box_office) >= 1_000_000_000;
    return okSearch && okCountry && okYear && okBig;
  });

  switch (sortSelect.value) {
    case "gross_desc":
      items.sort((a, b) => (Number(b.box_office) || 0) - (Number(a.box_office) || 0));
      break;
    case "gross_asc":
      items.sort((a, b) => (Number(a.box_office) || 0) - (Number(b.box_office) || 0));
      break;
    case "year_desc":
      items.sort((a, b) => (Number(b.release_year) || 0) - (Number(a.release_year) || 0));
      break;
    case "year_asc":
      items.sort((a, b) => (Number(a.release_year) || 0) - (Number(b.release_year) || 0));
      break;
    case "title_desc":
      items.sort((a, b) => normalizeText(b.title).localeCompare(normalizeText(a.title)));
      break;
    default:
      items.sort((a, b) => normalizeText(a.title).localeCompare(normalizeText(b.title)));
  }

  state.filtered = items;
  renderGrid(items);
}

async function init() {
  const response = await fetch("films.json");
  const films = await response.json();

  state.allFilms = films.map(film => ({
    ...film,
    title: normalizeText(film.title),
    director: normalizeText(film.director),
    country: normalizeText(film.country),
    poster_url: normalizeText(film.poster_url),
    release_year: film.release_year,
    box_office: film.box_office
  }));

  populateControls(state.allFilms);
  sortSelect.value = "gross_desc";
  applyFilters();
}

[randomBtn, countryFilter, yearFilter, sortSelect, billionOnly].forEach(el => {
  el.addEventListener("change", applyFilters);
});

searchInput.addEventListener("input", applyFilters);

randomBtn.addEventListener("click", () => {
  const pool = state.filtered.length ? state.filtered : state.allFilms;
  if (!pool.length) return;
  openModal(pool[Math.floor(Math.random() * pool.length)]);
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  countryFilter.value = "all";
  yearFilter.value = "all";
  sortSelect.value = "gross_desc";
  billionOnly.checked = false;
  applyFilters();
});

modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

init().catch((error) => {
  console.error(error);
  grid.innerHTML = `<article class="stat" style="grid-column:1/-1"><div class="value" style="font-size:24px">Failed to load films.json</div><div class="label">Make sure films.json is inside docs/</div></article>`;
});

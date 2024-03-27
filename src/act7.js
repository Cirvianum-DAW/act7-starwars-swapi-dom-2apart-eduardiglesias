import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
export async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  try {
    // Obtenim els elements del DOM amb `querySelector` i els emmagatzemem en una variable
    const titleElement = document.querySelector(titleSelector);
    const infoElement = document.querySelector(infoSelector);
    const directorElement = document.querySelector(directorSelector);

      // Comprovem si l'identificador de la pel·lícula és buit
      if (!movieId) {
        // Si l'identificador de la pel·lícula és buit, buidem els elements de la capçalera
        titleElement.innerHTML = '';
        infoElement.innerHTML = '';
        directorElement.innerHTML = '';
        return; // Sortim de la funció ja que no hi ha cap capçalera per mostrar
      }

    // Obtenim la informació de la pel·lícula cridant al mètode de `swapi.js`
    const movieInfo = await swapi.getMovieInfo(movieId);

    // Substituïm les dades fent servir un mètode de reemplaçament com `innerHTML`
    titleElement.innerHTML = movieInfo.name;
    infoElement.innerHTML = `Episodi ${movieInfo.episodeID} - ${movieInfo.release}`;
    directorElement.innerHTML = `Director: ${movieInfo.director}`;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function initMovieSelect(selector) {
  try {
    // Obtenim l'element del DOM corresponent al selector de pel·lícules
    const selectElement = document.querySelector(selector);

    // Obtenim la llista de pel·lícules ordenades utilitzant listMoviesSorted() de swapi.js
    const movies = await swapi.listMoviesSorted();

    // Creem una opció inicial "Selecciona una pel·lícula"
    const initialOption = document.createElement('option');
    initialOption.value = '';
    initialOption.textContent = 'Selecciona una pel·lícula';

    // Afegim la opció inicial al selector de pel·lícules
    selectElement.appendChild(initialOption);

    // Recorrem les pel·lícules i afegim cada una com una opció al selector
    movies.forEach((movie) => {
      const option = document.createElement('option');
      option.value = _filmIdToEpisodeId(movie.episodeID); // Opció valor és l'ID de l'episodi
      option.textContent = movie.name; // Opció text és el nom de la pel·lícula
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

export function deleteAllCharacterTokens() {
  try {
    // Obtenim tots els elements <li> amb les classes 'list__item' i 'character'
    const characterItems = document.querySelectorAll('.list__item.character');
    
    // Iterem sobre tots els elements i els eliminem
    characterItems.forEach(item => item.remove());
  } catch (error) {
    console.error('Error en eliminar les fitxes de personatges:', error);
  }
}

// EVENT HANDLERS //

export function addChangeEventToSelectHomeworld() {
  try {
    // Obtenim l'element select de "homeworld"
    const homeworldSelect = document.querySelector('#select-homeworld');

    // Afegim un event listener per a l'esdeveniment 'change' a l'element select de "homeworld"
    homeworldSelect.addEventListener('change', async (event) => {
      try {
        // Eliminem totes les fitxes de personatges
        deleteAllCharacterTokens();

        // Obtenim el valor seleccionat de l'element select de "pel·lícules" (ID de la pel·lícula)
        const selectedMovieId = document.querySelector('#select-movie').value;

        // Obtenim el valor seleccionat de l'element select de "homeworld" (nom del planeta)
        const selectedHomeworld = event.target.value;

        // Comprovem si s'han seleccionat una pel·lícula i un planeta vàlids
        if (selectedMovieId && selectedHomeworld) {
          // Obtenim les dades dels personatges i els seus planetes de la pel·lícula seleccionada utilitzant getMovieCharactersAndHomeworlds() de swapi.js
          const movieData = await swapi.getMovieCharactersAndHomeworlds(selectedMovieId);

          // Comprovem si l'objecte de dades conté el camp "characters" (personatges)
          if (movieData.hasOwnProperty('characters')) {
            // Filtrar els personatges que pertanyen al planeta seleccionat
            const charactersOnSelectedHomeworld = movieData.characters.filter(character => character.homeworld === selectedHomeworld);
            console.log(charactersOnSelectedHomeworld)
            // Crear les fitxes dels personatges que pertanyen al planeta seleccionat
            await _createCharacterTokens(charactersOnSelectedHomeworld);
          } else {
            console.error('No s\'ha pogut trobar la informació de personatges en les dades retornades.');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function _createCharacterTokens(characters) {
  try {
    // Seleccioneu la llista d'elements on afegirem les fitxes de personatges
    const characterList = document.querySelector('.list__characters');

    if (characters.length === 0) {
      // Si no hi ha personatges, mostrem un missatge
      const noCharactersMessage = document.createElement('li');
      noCharactersMessage.classList.add('list__item', 'item', 'no-characters');
      noCharactersMessage.textContent = 'No s\'han trobat personatges per a aquest planeta.';
      characterList.appendChild(noCharactersMessage);
    } else{
          // Iterem sobre cada personatge per crear la seva fitxa
    characters.forEach(character => {
      // Creem un element <li> per a cada personatge
      const characterItem = document.createElement('li');
      characterItem.classList.add('list__item', 'item', 'character');

      // Obtenim el número d'imatge del personatge de la URL
      const imageNumber = getImageNumberFromUrl(character.url);



      // Creem l'estructura interna de la fitxa del personatge
      characterItem.innerHTML = `
        <img src="assets/people/${imageNumber}.jpg" class="character__image" />
        <h2 class="character__name">${character.name}</h2>
        <div class="character__birth"><strong>Birth Year:</strong> ${character.birth_year}</div>
        <div class="character__eye"><strong>Eye color:</strong> ${character.eye_color}</div>
        <div class="character__gender"><strong>Gender:</strong> ${character.gender}</div>
        <div class="character__home"><strong>Home World:</strong> ${character.homeworld}</div>
      `;

      // Afegim la fitxa del personatge a la llista de personatges
      characterList.appendChild(characterItem);
    });
    }

  } catch (error) {
    console.error('Error creating character tokens:', error);
  }
}

function getImageNumberFromUrl(url) {
  // Utilitzem una expressió regular per trobar el número al final de la URL
  const matches = url.match(/\/(\d+)$/);
  if (matches && matches.length > 1) {
    // La coincidència 1 conté el número de foto
    return matches[1];
  } else {
    // Si no es troba cap número a la URL, retornem null
    return null;
  }
}


function _addDivChild(parent, className, html) {}

function setMovieSelectCallbacks() {
  try {
    // Obtenim l'element select de pel·lícules
    const selectElement = document.querySelector('#select-movie');

    // Afegim un event listener per a l'esdeveniment 'change' a l'element select
    selectElement.addEventListener('change', async (event) => {
      try {
        // Buidem el selector de "homeworld"
        const homeworldSelect = document.querySelector('#select-homeworld');
        homeworldSelect.innerHTML = ''; // Buidem tots els elements continguts

        // Eliminem totes les fitxes de personatges
        deleteAllCharacterTokens();

        // Obtenim el valor seleccionat de l'element select (ID de la pel·lícula)
        const selectedMovieId = event.target.value;

        // Actualitzem la capçalera de la pel·lícula
        await setMovieHeading(selectedMovieId, '.movie__title', '.movie__info', '.movie__director');


        // Comprovem si s'ha seleccionat una pel·lícula (no és la opció "Selecciona una pel·lícula")
        if (selectedMovieId) {
          // Obtenim el objecte de personatges i els seus planetes de la pel·lícula seleccionada utilitzant getMovieCharactersAndHomeworlds() de swapi.js
          const movieData = await swapi.getMovieCharactersAndHomeworlds(selectedMovieId);

          // Comprovem si l'objecte de dades conté el camp "characters" (personatges)
          if (movieData.hasOwnProperty('characters')) {
            // Obtenim els personatges i els seus planetes
            const charactersAndHomeworlds = movieData.characters;

            // Obtenim els planetes dels personatges i eliminem duplicats i els ordenem alfabèticament
            const homeworlds = _removeDuplicatesAndSort(charactersAndHomeworlds.map(character => character.homeworld));

            // Creem una opció inicial "Selecciona un homeworld"
            const initialOption = document.createElement('option');
            initialOption.value = '';
            initialOption.textContent = 'Selecciona un homeworld';

            // Afegim la opció inicial al selector de "homeworld"
            homeworldSelect.appendChild(initialOption);

            // Afegim cada homeworld com una opció al selector de "homeworld"
            homeworlds.forEach(homeworld => {
              const option = document.createElement('option');
              option.value = homeworld;
              option.textContent = homeworld;
              homeworldSelect.appendChild(option);
            });
          } else {
            console.error('No s\'ha pogut trobar la informació de personatges en les dades retornades.');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

async function _handleOnSelectMovieChanged(event) {}

function _filmIdToEpisodeId(episodeID) {
    // Busquem l'objecte que té l'episodi corresponent a l'episodeID
    const mapping = episodeToMovieIDs.find(item => item.e === episodeID);
  
    // Si s'ha trobat el mapping, retornem l'identificador de la pel·lícula (m)
    if (mapping) {
      return mapping.m;
    } else {
      // Si no es troba cap mapping, retornem null
      return null;
    }
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

function _setMovieHeading({ name, episodeID, release, director }) {}

function _populateHomeWorldSelector(homeworlds) {}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;

// Učitaj JSON fajl sa odgovorima
const responses = require("../db/responses.json");
// Učitaj paket za rad sa sinonimima
const synonyms = require("synonyms");

// Kontroler koji obrađuje poruke od klijenta
const get_response = message => {
  // Uzmi ključeve iz objekta responses
  const keys = Object.keys(responses);

  // Sanitizuj (očisti) poruku
  message = sanitize_string(message);

  // Ako poruka nije prisutna, vrati podrazumevani odgovor
  if (!message) return "Try something else";

  // Razdvoji poruku na niz reči
  let wordArray = message.split(/\s+/);

  // Preuzmi sinonime za svaku reč u nizu i dodaj ih u niz reči
  wordArray.forEach(word => {
    const wordSynonym = synonyms(word);
    if (wordSynonym) {
      if (wordSynonym.n) wordArray = wordArray.concat(wordSynonym.n);
      if (wordSynonym.v) wordArray = wordArray.concat(wordSynonym.v);
      if (wordSynonym.s) wordArray = wordArray.concat(wordSynonym.s);
      if (wordSynonym.a) wordArray = wordArray.concat(wordSynonym.a);
    }
  });

  // Nađi ključ koji odgovara rečima
  const matchingKey = get_matching_key(keys, wordArray);

  // Ako nema odgovarajućeg ključa, vrati podrazumevani odgovor
  if (!matchingKey) return "Try something else";

  let possibleResponses = [];

  // Izaberi odgovore koji odgovaraju pronađenom ključu
  for (let key in responses) {
    if (key === matchingKey) {
      possibleResponses = responses[key];
      break;
    }
  }

  // Izaberi nasumičan odgovor iz mogućih odgovora
  let randomNumber = Math.floor(Math.random() * possibleResponses.length);
  return possibleResponses[randomNumber];
};

// Pomoćna funkcija za pronalaženje odgovarajućeg ključa
const get_matching_key = (keys, words) => {
  let currMatchCount = 0;
  let highestMatchCount = 0;
  let matchedKey = "";

  // Izračunaj najbolji ključ za odgovor
  keys.forEach(key => {
    words.forEach(word => {
      if (word.length > 1) {
        if (key.includes(word)) currMatchCount++;
      }
    });
    if (currMatchCount > highestMatchCount) {
      highestMatchCount = currMatchCount;
      matchedKey = key;
    }
    currMatchCount = 0;
  });
  return matchedKey;
};

// Funkcija za sanitizaciju (čišćenje) stringa
const sanitize_string = text => {
  // Regularni izraz za uklanjanje članova rečenica (the, a, an)
  const regex = /(?:(the|a|an) +)/g;
  const result = text.replace(regex, ` `);
  return result.trim().toLowerCase();
};

// Izvezi funkcije kako bi bile dostupne u drugim delovima aplikacije
module.exports = { get_response, get_matching_key, sanitize_string };

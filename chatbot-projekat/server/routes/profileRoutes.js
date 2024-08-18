// Učitaj Express paket
const express = require("express");
// Kreiraj novi Express router koji se koristi za definisanje ruta
const router = express.Router();
// Učitaj kontroler za profile koji sadrži logiku za obradu zahteva vezanih za profile
const profileController = require("../controllers/profileController");

// Ruta za dobijanje profila korisnika na osnovu ID-a korisnika
router.get("/:userId", profileController.get_profile);

// Ruta za kreiranje ili ažuriranje profila
router.post("/", profileController.create_profile);

// Izvezi router kako bi bio dostupan u drugim delovima aplikacije
module.exports = router;

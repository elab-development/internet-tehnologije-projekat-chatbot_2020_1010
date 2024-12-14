const Profile = require("../models/Profile");

// Kontroler za preuzimanje profila
const get_profile = async (req, res) => {
    try {
      // Pronađi profil korisnika po ID-u
      const profile = await Profile.findOne({ user: req.params.userId });
      if (!profile) return res.status(404).json({ error: "Profile not found" });
      // Vrati profil kao odgovor
      res.json(profile);
    } catch (error) {
      // Ako dođe do greške, vrati grešku
      res.status(500).json({ error: error.message });
    }
  };



// Izvoz kontrolera
module.exports = {
    get_profile
};

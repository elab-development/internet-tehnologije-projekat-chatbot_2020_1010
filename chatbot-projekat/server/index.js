// Ako nije u produkciji, učitaj konfiguraciju iz .env fajla
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Učitaj potrebne pakete
const bcrypt = require("bcryptjs"); // Paket za hashovanje lozinki
const express = require("express"); // Paket za kreiranje Express aplikacije
const mongoose = require("mongoose"); // Paket za rad sa MongoDB bazom podataka
const morgan = require("morgan"); // Paket za logovanje HTTP zahteva
const bp = require("body-parser"); // Paket za parsiranje tela HTTP zahteva
const jwt = require("jsonwebtoken"); // Paket za rad sa JSON Web Tokenima
const cors = require("cors"); // Paket za omogućavanje CORS-a (Cross-Origin Resource Sharing)
const User = require("./models/User"); // Model za rad sa korisnicima
const Message = require("./models/Message"); // Model za rad sa porukama
const { get_response } = require("./handler/responseHandler"); // Funkcija za generisanje odgovora na poruke

// Kreiranje Express aplikacije
const app = express();
// Omogućavanje CORS-a
app.use(cors());
// Kreiranje HTTP servera koristeći Express aplikaciju
const http = require("http").createServer(app);

// PORT na kojem će aplikacija raditi (podrazumevano 5000)
const PORT = process.env.PORT || 5000;

// URI konekcije sa MongoDB bazom podataka
const db = process.env.MONGO_URI;

// Funkcija za kreiranje admin korisnika
async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL; // Email za admin korisnika
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) { // Ako admin korisnik ne postoji
      const salt = await bcrypt.genSalt(10); // Generiši so za hashovanje
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt); // Hashuj lozinku

      // Kreiraj novog admin korisnika
      const adminUser = new User({
        name: "ChatBot Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });

      await adminUser.save(); // Sačuvaj admin korisnika u bazu
      console.log("Admin user created:", adminUser);
    } else {
      console.log("Admin user already exists"); // Ako admin korisnik već postoji
    }
  } catch (error) {
    console.error("Error creating admin user:", error); // Ako dođe do greške
  }
}

// Konektovanje na bazu podataka
mongoose
  .connect(db)
  .then(async () => {
    console.log(`Database connected`);
    // Pozovi funkciju za kreiranje admin korisnika
    await createAdminUser();
    // Pokreni HTTP server
    http.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
  })
  .catch((err) => console.log(err)); // Ako dođe do greške pri konektovanju na bazu

// Inicijalizuj Socket.io za komunikaciju u realnom vremenu
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Dozvoli CORS sa ove adrese, za frontend
  },
});

// Rukovanje događajem kada se korisnik poveže
io.on("connection", socket => {
  console.log("user is connected");

  // Pošalji dobrodošlicu trenutnom korisniku
  socket.emit("message", "Welcome to chat bot");

  // Slušaj za chat poruke
  socket.on("message", async msg => {
    try {
      const decoded = jwt.verify(msg.token, process.env.JWT_SECRET); // Verifikuj JWT token
      const userId = decoded.id; // Izvuci ID korisnika iz tokena
      const response = get_response(msg.text); // Generiši odgovor na poruku
      const messageToAppend = { text: msg.text, response };

      // Kreiraj novu poruku
      const newMessage = new Message(messageToAppend);
      await newMessage.save(); // Sačuvaj novu poruku u bazu

      // Ažuriraj korisnika sa referencom na novu poruku
      await User.findByIdAndUpdate(userId, { $push: { messages: newMessage._id } });

      // Emituj poruku i odgovor nazad klijentu
      socket.emit("response", newMessage);
    } catch (error) {
      console.error("Error handling message:", error); // Ako dođe do greške u rukovanju porukom
    }
  });

  // Rukovanje događajem kada se korisnik diskonektuje
  socket.on("disconnect", () => {
    console.log("user has left");
  });
});

// --- MIDDLEWARE ---
// Middleware za logovanje HTTP zahteva
app.use(morgan("dev"));

// Middleware za parsiranje JSON podataka
app.use(bp.json());
// Middleware za parsiranje URL enkodiranih podataka (form data)
app.use(bp.urlencoded({ extended: false }));

// Rute za korisnike
app.use("/users", require("./routes/userRoutes"));

// Rute za chat
app.use("/chat", require("./routes/chatRoutes"));

// Rute za poruke
app.use("/messages", require("./routes/messageRoutes"));

// Rute za profile
app.use("/profiles", require("./routes/profileRoutes"));


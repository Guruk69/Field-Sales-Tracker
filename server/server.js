const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();

// 🔥 Middleware
app.use(express.json());
app.use(cors({
  origin: "*"
}));

// 🔐 Secret key
const SECRET = "mysecretkey";

// 🧠 Temporary DB (in-memory)
const users = [];

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🚀 REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🛡️ AUTH MIDDLEWARE
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// 🔒 Protected route
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome " + req.user.email
  });
});

// 🚀 PORT (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const bcrypt = require("bcryptjs");

// temporary in-memory DB
const users = [];

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    users.push({
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
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
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome " + req.user.email,
  });
});
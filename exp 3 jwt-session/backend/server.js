const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Mock user
const user = {
    id: 1,
    username: "admin",
    password: "admin123",
    name: "Chetan"
};

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username !== user.username || password !== user.password) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            name: user.name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.json({
        message: "Login successful",
        token
    });
});

// JWT verification middleware
function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, userData) => {

            if (err) {
                return res.status(403).json({
                    message: "Invalid or expired token"
                });
            }

            req.user = userData;
            next();
        }
    );
}

// PROTECTED ROUTE
app.get("/dashboard", authenticateToken, (req, res) => {

    res.json({
        message: "Welcome to protected dashboard!",
        user: req.user
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
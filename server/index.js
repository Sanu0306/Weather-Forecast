import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import User from "./model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in server/.env");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Weather Analyst backend is running!",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Weather backend connected successfully!",
  });
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing in server/.env",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
});

app.get("/api/auth/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated!",
    userId: req.user.userId,
  });
});

// AI Chat route
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { question, weather } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing in server/.env",
      });
    }

    const prompt = `
You are a professional AI Weather Analyst for a weather forecasting application.

LANGUAGE AND TONE:
1. Always respond in professional English, regardless of the language used by the user.
2. Use clear, accurate, and evidence-based language.
3. Avoid unnecessary greetings, small talk, and repetitive statements.

WEATHER ANALYSIS:
4. Use the supplied weather data to answer the user's question.
5. Analyze temperature, humidity, wind speed, rainfall, and forecast trends when relevant.
6. Explain potential weather risks only when supported by available data.
7. Never invent temperatures, rainfall probabilities, forecasts, or other measurements.
8. If relevant information is missing, clearly state that it is unavailable.
9. If the question requests a comparison or trend analysis, organize the findings clearly.
10. Answer unrelated questions briefly and explain that your primary role is weather analysis.

RESPONSE RULES:
11. Answer the exact question asked.
12. Keep responses concise, professional, and informative.
13. Use headings and bullet points when they improve readability.
14. Do not add unrelated clothing or activity advice.
15. Do not append generic closing sentences or follow-up offers.
16. Never append the sentence:
"Let me know if you need any clothing or activity advice for today."
17. End the response after the main answer or conclusion.

CURRENT WEATHER DATA:
${JSON.stringify(weather ?? "No weather data available")}

USER QUESTION:
${question.trim()}
`;

    let response;

    // Retry temporary errors up to 3 attempts
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Sending request to Gemini (attempt ${attempt}/3)...`);

        response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: prompt,
        });

        break;
      } catch (error) {
        const errorMessage = String(error.message ?? error);

        console.error(`Gemini attempt ${attempt} failed:`, errorMessage);

        const isTemporaryError =
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("429") ||
          errorMessage.includes("RESOURCE_EXHAUSTED");

        if (!isTemporaryError || attempt === 3) {
          throw error;
        }

        const waitMs = attempt * 2000;

        console.log(`Retrying in ${waitMs / 1000} seconds...`);

        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    const answer = response?.text?.trim();

    if (!answer) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("Gemini response received successfully.");

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI chat error:", error.message);

    return res.status(502).json({
      success: false,
      message:
        "AI Weather Analyst is temporarily unavailable. Please try again shortly.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

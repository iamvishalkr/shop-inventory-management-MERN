import "dotenv/config";
import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes/index.js";
import { authRoutes } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { generalLimiter } from "./middleware/rate-limiter.middleware.js";
import { connectDB } from "./lib/db.js";
import testSeedProducts from "./utils/testSeedProducts.js";

const app = express();
const PORT = process.env.PORT || 4000;
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:3000";


app.use(
    cors({
        origin: clientUrl,
        credentials: true,
    }),
);

app.use(express.json());

// Mount authentication routes (which have strict internal rate limiting & custom validations)
app.use("/api/auth", authRoutes);

// Apply generous rate limit to all other routes
app.use(generalLimiter);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.get("/seedProducts", async (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ status: false, message: "Forbidden in production" });
    }
    try {
        const result = await testSeedProducts();
        res.json(result);
    } catch (error) {
        next(error);
    }
});


registerRoutes(app);

app.use(errorHandler)


app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();
});


////////////////////////////////////////////////IMPORTS////////////////////////////////////////////////
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//------------------------------------DEPENDENCIES--------------------------------//
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const PORT = process.env.PORT || 3000;
const axios = require("axios");
//SOCKET
// const https = require("https"); //only use when we will deploy it in actual owned server
const http = require("http");

//Security
// const fs = require("fs");
// const options = {
//   key: fs.readFileSync("key.pem"), // Path to your private key
//   cert: fs.readFileSync("cert.pem"), // Path to your self-signed certificate
// };

const socketIo = require("socket.io");
const app = express();
// const server = https.createServer(options, app);
const server = http.createServer(app);

const allowedOrigins = [
  "https://the-auction-x.onrender.com", // Production frontend
  "http://localhost:3000", // Local development
  process.env.CLIENT_URL, // Environment variable fallback
].filter(Boolean); // Remove any undefined values

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins, // your frontend URL
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "x-csrf-token",
      "X-CSRF-Token",
      "Authorization",
    ],
    credentials: true, // Allow credentials if needed (cookies or headers)
  },
});

// if (process.env.NODE_ENV === "production") {
//   app.use((req, res, next) => {
//     if (req.headers["x-forwarded-proto"] !== "https") {
//       return res.redirect(`https://${req.headers.host}${req.url}`);
//     }
//     next();
//   });
// }

//------------------------------------LOGIN ROUTES--------------------------------//
const AuthRoutes = require("./routes/LoginRoutes/UserAuthRoutes.js");
const sellerRoutes = require("./routes/LoginRoutes/SellerAuthRoutes.js");
// const AdminRoutes = require("./routes/SellerRoutes/adminRoutes.js");
const configureGoogleStrategy = require("./utlis/Auth2.0/passportGoogleStrategy.js");
const GoogleAuthRoutes = require("./routes/LoginRoutes/UserAuthRoutes.js");

//------------------------------------USER ROUTES--------------------------------//
const privacyRoutes = require("./routes/UserRoutes/privacyRequests/privacyRequests.js");
const contactRoutes = require("./routes/UserRoutes/contactRoutes/contactRoutes.js");
const faqRoutes = require("./routes/UserRoutes/faqRoutes/faqRoutes.js");
const feedbackRoutesUser = require("./routes/UserRoutes/feedbackRoutes/feedbackRoutes.js");
const productFeedbackRoutes = require("./routes/UserRoutes/productFeedbackRoutes/productFeedbackRoutes.js");
//------------------------------------SELLER ROUTES--------------------------------//

//------------------------------------ADMIN ROUTES--------------------------------//
const customerRoutes = require("./routes/AdminRoutes/E-COMMERCE/CustomerRoutes.js");
const InventoryRoutes = require("./routes/AdminRoutes/E-COMMERCE/InventoryRoutes.js");
const orderRoutes = require("./routes/AdminRoutes/E-COMMERCE/OrderRoutes.js");
const feedbackRoutes = require("./routes/AdminRoutes/OTHERS/FeedbackRoutes.js");
const reportRoutesAdmin = require("./routes/AdminRoutes/OTHERS/ReportsRoutes.js");
const goodieRoutes = require("./routes/AdminRoutes/OTHERS/GoodieRoutes.js");
const adminProfileRoutes = require("./routes/AdminRoutes/SETTINGS/AdminProfileRoutes.js");
const transactionRoutes = require("./routes/AdminRoutes/FINANCE/TransactionRoutes.js");
const subscriptionRoutes = require("./routes/AdminRoutes/FINANCE/SubscriptionRoutes.js");
const banners = require("./routes/AdminRoutes/TASKS/BannerRoutes.js");
const eventRoutes = require("./routes/AdminRoutes/TASKS/EventsRoutes.js");
const calendarRoutes = require("./routes/AdminRoutes/TASKS/CalendarRoutes.js");
const notificationRoutes = require("./routes/AdminRoutes/SETTINGS/AdminNotificationRoutes.js");
const adminSellerRoutes = require("./routes/AdminRoutes/SELLER-MANAGEMENT-ROUTES/SellerRoutes.js");

const AdminNewRoutes = require("./routes/AdminRoutes/AdminRoutes.js");

//------------------------------------PRODUCT ROUTES--------------------------------//
const productRoutes = require("./routes/SellerRoutes/productRoutes.js");
const OrderRoutes = require("./routes/SellerRoutes/orderRoutes.js");

//------------------------------------SECURITY & MIDDLEWARES--------------------------------//

const errorHandler = require("./middleware/Security/ErrorHandler.js");

const {
  logger,
  httpLogger,
} = require("./middleware/Security/LoggerMiddleware.js"); // Import Winston + Morgan

const helmet = require("helmet");

const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const mongoSanitize = require("express-mongo-sanitize");
const sanitize = (data) => JSON.parse(JSON.stringify(data)); // Removes undefined & null values

//------------------------------------OTHERS--------------------------------//
const DbCon = require("./utlis/Database/db.js");
const seedDatabase = require("./utlis/SeedData/seedData.js");
const socketRoutes = require("./routes/OtherRoutes/SocketRoutes.js");

////////////////////////////////////////////////USAGE////////////////////////////////////////////////

//------------------------------------OTHERS--------------------------------//
app.use("/socket", socketRoutes(io)); // The path '/socket' is optional here

// MongoDB connection
async function startServer() {
  await DbCon(); // Wait for the database connection
  await seedDatabase(); // Run seeding only after DB connection
}
startServer();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "x-csrf-token",
      "X-CSRF-Token",
      "Authorization",
    ],
    credentials: true,
    origin: allowedOrigins,
  })
);

//------------------------------------LOGIN USAGES--------------------------------//
// Configure Passport Strategies
configureGoogleStrategy();
app.use(GoogleAuthRoutes);
app.use("/api/auth", AuthRoutes);

//TESTING(kunal)
app.use("/api/auth/user", AuthRoutes);
app.use("/api/auth/seller", sellerRoutes);
app.use("/api", faqRoutes);

//------------------------------------USER USAGES--------------------------------//
app.use("/api/privacy", privacyRoutes);
app.use("/api/contact", contactRoutes);
// app.use("/api/reports", reportRoutes);
app.use("/api/feedback/user", feedbackRoutesUser);
app.use("/api/goodies", goodieRoutes);
app.use("/api/product-feedback", productFeedbackRoutes);
//------------------------------------SELLER USAGES--------------------------------//

//------------------------------------ADMIN USAGES--------------------------------//

//DEFECT BUT WORKING
app.use("/api/admin", reportRoutesAdmin);
app.use("/api/transactions", transactionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/banners", banners);
app.use("/api/events", eventRoutes);
app.use("/api/calendar", calendarRoutes);
//revenue admin page product list
app.use("/api/items", InventoryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sellers", adminSellerRoutes);

//MAIN
app.use("/api/admin", AdminNewRoutes);

//NOT USED
// app.use("/api/admin/customers", customerRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/feedbacks", feedbackRoutes);
// app.use("/api/admins", AdminRoutes);
// app.use("/api/adminProfile", adminProfileRoutes);

//------------------------------------PRODUCT USAGES--------------------------------//
app.use("/api/products", productRoutes);
app.use("/api/orders", OrderRoutes);

//------------------------------------SECURITY & MIDDLEWARES--------------------------------//
//SECURITY
// app.set("trust proxy", true);
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Trust the first proxy (Render's)
}

//  Error Handling Middleware (Must be the last one)
app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(httpLogger);
}
app.use(helmet()); // Apply security headers

// app.use(csrfProtection);
// app.get("/api/csrf-token", (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// Add this right after cookieParser() and helmet()
app.use(csrfProtection); // Move this line UP

// Add this route IMMEDIATELY after csrfProtection
app.get("/api/csrf-token", (req, res) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false, // Must be false for client-side JS to read
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ csrfToken: req.csrfToken() });
});

app.use(
  mongoSanitize({
    replaceWith: "_", // Replaces "$" and "." with "_"
  })
);

app.use((req, res, next) => {
  req.body = sanitize(req.body);
  next();
});

///////////////////////////////////////////////////////////////////////////////

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//---------------------Testing-----------------
app.get("/api/recommendations/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { count = 10 } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const encodedEmail = encodeURIComponent(email);

    const response = await axios.get(
      `http://localhost:8000/api/recommendations/${encodedEmail}`,
      {
        params: { count },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error || "Failed to fetch recommendations";
    res.status(statusCode).json({ error: errorMessage });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

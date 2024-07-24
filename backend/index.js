import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js";
import bodyParser from "body-parser";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";

// configure dotenv
dotenv.config();
// dotenv.config({path : './'}); // path is not needed if in root folder, it gives error

connectDB();
// process by default by node
const port = process.env.PORT || 8080;

// rest object
// line of code used in Node.js applications to initialize an instance of an Express application.
const app = express();

// middlewares
app.use(express.json())
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoute)

// rest api's
app.get('/', (req, res) => {
    // res.send({
    //     message : "Welcome to Ecommerce app"
    // })
    res.send("<h1>Welcome</h1>");
})

// Run listen
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
} )

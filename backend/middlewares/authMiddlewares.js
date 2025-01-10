import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import HttpError from "../models/http-error.js";

// const requireSignIn = async (req, res, next) => {
//   console.log("Request URL:", req.url);
//   console.log("Request Method:", req.method);
//   console.log("Authorization Header:", req.headers.authorization);
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       const token = req.headers.authorization.split(" ")[1];

//       if (!token) {
//         return next(new HttpError("Token not found.", 401));
//       }

//       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//       const user = await User.findById(decodedToken.userId);
//       // console.log(user);

//       if (!user) {
//         return next(
//           new HttpError("Authentication failed! User not found.", 401)
//         );
//       }

//       req.user = user;

//       next();
//     } catch (error) {
//       console.log(error);
//       if (
//         error.name === "TokenExpiredError" &&
//         error.message === "jwt expired"
//       ) {
//         return next(new HttpError("Token Expired.", 401));
//       }
//       return next(new HttpError("Invalid token. Authentication failed!", 401));
//     }
//   } else {
//     return next(new HttpError("Token not found.", 401));
//   }
// };

// const requireSignIn = async (req, res, next) => {
//   console.log("Request URL:", req.url);
//   console.log("Request Method:", req.method);
//   console.log("Authorization Header:", req.headers.authorization);

//   // Check for authorization header and validate format
//   if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
//     return next(new HttpError("Authorization header is missing or invalid.", 401));
//   }

//   const token = req.headers.authorization.split(" ")[1];
//   if (!token) {
//     return next(new HttpError("Token not found.", 401));
//   }

//   try {
//     // Verify the token
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//     // Fetch the user from the database
//     let user;
//     try {
//       user = await User.findById(decodedToken.userId);
//     } catch (dbError) {
//       console.error("Database error:", dbError);
//       return next(new HttpError("Internal Server Error. Please try again later.", 500));
//     }

//     if (!user) {
//       return next(new HttpError("Authentication failed! User not found.", 401));
//     }

//     // Attach the user to the request object
//     req.user = user;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);

//     if (error.name === "TokenExpiredError") {
//       return next(new HttpError("Token expired. Please log in again.", 401));
//     }
//     return next(new HttpError("Invalid token. Authentication failed!", 401));
//   }
// };

// const admin = (req, res, next) => {
//   if (req.user?.isAdmin) {
//     console.log("Admin");

//     next();
//   } else {
//     console.log("BOmb");
//     next(new HttpError("Not authorized as admin.", 401));
//   }

// };

const requireSignIn = async (req, res, next) => {
  console.log("Entering requireSignIn");
  try {
    // Check Authorization header
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      console.log("Authorization header is missing or invalid");
      return next(new HttpError("Authorization header is missing or invalid.", 401));
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.log("Token not found");
      return next(new HttpError("Token not found.", 401));
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.userId);
    if (!req.user) {
      console.log("User not found");
      return next(new HttpError("Authentication failed! User not found.", 401));
    }

    console.log("Exiting requireSignIn");
    next(); // Pass control to next middleware
  } catch (error) {
    console.error("Error in requireSignIn:", error);
    return next(new HttpError("Authentication failed!", 401));
  }
};

const admin = (req, res, next) => {
  console.log("Entering admin middleware");
  if (req.user?.isAdmin) {
    console.log("User is admin");
    return next();
  }
  console.log("User is not admin");
  return next(new HttpError("Not authorized as admin.", 401));
};


export { requireSignIn, admin };

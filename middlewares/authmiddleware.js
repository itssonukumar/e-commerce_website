import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
};

//admin acceess

export const isAdmin = async (req, res, next) => {
  try {
      // Check if req.user exists
      if (!req.user || !req.user._id) {
          return res.status(403).json({ error: 'Access denied.' });
      }

      // Fetch the user from the database to check the role
      const user = await userModel.findById(req.user._id);

      console.log('User fetched from database in isAdmin middleware:', user);

      if (!user || user.role !== 'admin') {
          return res.status(403).json({ error: 'Admin resource. Access denied.' });
      }
     
      next();
  } catch (error) {
      console.error('Error in isAdmin middleware:', error.message);
      res.status(500).json({ error: 'Server error.' });
  }
};
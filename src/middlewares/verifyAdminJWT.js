import jwt from "jsonwebtoken";

export const verifyAdminJWT = (req, res, next) => {
  console.log("Verifying Admin JWT middleware");
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    console.log("No Authorization header found");
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];
  console.log("Token: ", token);
  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification failed:", err);
      return res.sendStatus(403); // Token is not valid or expired
    }
    console.log("JWT verification successful");
    req.user = decoded.AdminInfo.email; // Ensure you access the correct property
    req.role = decoded.AdminInfo.role; // If you want to store the role
    next();
  });
};

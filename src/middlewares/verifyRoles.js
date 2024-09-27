export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("Verifying role...");

    // Check if the role exists in the request
    if (!req?.role) {
      console.log("No role found in request");
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];
    console.log(`Allowed roles: ${rolesArray}`);

    // Check if the user's role is included in the allowed roles
    if (!rolesArray.includes(req.role)) {
      console.log("Role not found in allowed roles");
      return res.sendStatus(403); // Use 403 Forbidden
    }

    console.log("Role verified");
    next();
  };
};

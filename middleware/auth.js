import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN);

    req.user = {
      userId: payload.userId,
      name: payload.name,
      image: payload.image,
      role: payload.role,
      token: payload.token,
    };

    next();
  } catch (error) {
    console.log("JWT Error:", error.message);
    res.status(401).json({ error: "Unauthorized" }); 
  }
};

export const permission = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ err: "Unauthorized to perform this action" });
    }
    next();
  };
};

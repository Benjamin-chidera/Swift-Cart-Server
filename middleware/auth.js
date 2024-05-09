import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN);
    console.log(token,  "tokens", payload, "payload");

    req.user = {
      userId: payload.userId,
      name: payload.name,
      image: payload.image,
      role: payload.role,
      token: payload.token,
    };

    next();
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Error Verification" });
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

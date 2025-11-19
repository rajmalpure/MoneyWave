import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";

const buildAuthResponse = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
  };

  return {
    user: payload,
    token: signToken(user._id),
  };
};

export const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email already in use" });
      }
      if (existingUser.username === username.toLowerCase()) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
    });

    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};


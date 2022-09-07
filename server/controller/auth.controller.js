const User = require("../model/user.model");
const generateTokens = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exist" });
      }

      const user = new User({
        firstName,
        lastName,
        email,
        password,
      });
      const newUser = await user.save();

      const accessToken = generateTokens.accessToken({
        id: newUser._id,
      });

      const refreshToken = generateTokens.refreshToken({
        id: newUser._id,
      });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        // secure: true,
      });

      res.json({
        message: "Registered Successful",
        user: { ...newUser._doc, password: "" },
        refreshToken,
        accessToken,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatchPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isMatchPassword) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const accessToken = generateTokens.accessToken({
        id: existingUser._id,
      });

      const refreshToken = generateTokens.refreshToken({
        id: existingUser._id,
      });

      // res.cookie("refreshtoken", refreshToken, {
      //   httpOnly: true,
      //   maxAge: 7 * 24 * 60 * 60 * 1000,
      //   sameSite: "None",
      //   // secure: true,
      // });
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/auth/refreshtoken",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: true,
      });

      res.json({
        message: "Login Successful",
        user: { ...existingUser._doc, password: "" },
        refreshToken,
        accessToken,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refToken = req.cookies["refreshtoken"];

      if (!refToken) return res.status(400).json({ msg: "Please login!" });

      const decoded = jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET);

      if (!decoded) return res.status(400).json({ msg: "Please login!" });

      const user = await User.findById(decoded.id).select("-password");

      if (!user)
        return res
          .status(400)
          .json({ msg: "User does not exist, Please login!" });

      const access_token = generateTokens.accessToken({ id: user._id });

      res.json({ access_token, user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None",
        // secure: true,
      });

      return res.json({ msg: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;

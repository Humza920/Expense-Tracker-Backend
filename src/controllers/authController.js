const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const generateToken = require("../utils/generatetoken");

exports.register = async (req, res) => {
  const { fullName, emailAddress, password, profileImg } = req.body;

  try {
    if (!fullName || !emailAddress || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    if (!validator.isEmail(emailAddress)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be strong (uppercase, lowercase, number, symbol, 8+ characters)",
      });
    }

    const existingUser = await User.findOne({ emailAddress });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALTED_ROUNDS));

    const user = await User.create({
      fullName,
      emailAddress,
      password: hashedPassword,
      profileImg,
    });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPass } = user._doc;

    res.status(201).json({
      success: true,
      message: "Signup Successful",
      user: userWithoutPass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress)
      return res.status(400).json({ success: false, message: "Enter your Email Address" });
    if (!password)
      return res.status(400).json({ success: false, message: "Enter your Password" });

    const user = await User.findOne({ emailAddress }).select("+password");
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPass } = user._doc;
    res.status(200).json({
      success: true,
      message: "Login Successful",
      user: userWithoutPass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ success: true, message: "Logout Successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. User not found in request.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error in getMe:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

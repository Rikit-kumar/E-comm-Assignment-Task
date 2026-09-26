import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateToken, verifyRefreshToken } from "../util/auth.util.js";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isUserExists = await userModel.findOne({ email });

    if (isUserExists) {
      return res.status(409).json({
        message: "User already exists with this email address",
        error: [
          {
            path: "email",
            message: "User already exists with this email address",
          },
        ],
      });
    }

    const user = await userModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.log("register Controller error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Unauthorized, Invalid email or password",
      });
    }

    const { refreshToken, accessToken } = generateToken({ id: user._id });

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "User loggedIn successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.log("loginuser controller error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const tokenRefreshController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized, Refresh token not found",
      });
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized, User not found",
        });
      }

      if (refreshToken !== user.refreshToken) {
        await userModel.findByIdAndUpdate(user._id, {
          refreshToken: null,
        });

        res.clearCookie("refreshToken");

        return res.status(401).json({
          message: "Unauthorized, Refresh token mismatch",
        });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateToken({
        id: user._id,
      });

      await userModel.findByIdAndUpdate(user._id, {
        refreshToken: newRefreshToken,
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
      });

      res.status(200).json({
        message: "Tokens refresh successfully",
        accessToken,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized, Invalid or expire refresh token",
      });
    }
  } catch (error) {
    console.log("token refresh controller error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, user not found",
      });
    }

    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: null
    });

    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("logout controller error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const userDetailsController = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized, user not found",
      });
    }

    return res.status(200).json({
      message: "User detail fetched successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.log("user details controller error", error);
  }
};

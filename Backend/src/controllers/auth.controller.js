import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../util/auth.util.js";

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
      message: "User registered successfull",
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

import { registrationWelcome } from "../mail/index.js";
import User from "../models/User.js";
import addUserSchema from "../schemas/add-user-schema.js";
import updateUserSchema from "../schemas/update-user-schema.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-_id -__v").lean();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error, "this error");
    return res.status(500).json({
      message: "An error occurred while fetching users",
    });
  }
};

export const createUser = async (req, res) => {
  // 1) Validate request body
  const { error: validationError, value } = addUserSchema().validate(req.body);
  if (validationError) {
    return res
      .status(400)
      .json({ message: validationError.details.map((d) => d.message) });
  }

  const { name, email } = value;

  try {
    // 2) Try to save—unique index on email guarantees atomicity
    const user = new User({ name, email });
    await user.save();

    // 3) Only send welcome mail after a successful insert
    await registrationWelcome(email, name);

    return res.status(201).json(user);
  } catch (err) {
    console.error("createUser error:", err);

    // 4) If it's the duplicate-email error, return 409
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(409).json({ message: "This email already exists." });
    }

    // 5) Otherwise, generic server error
    return res
      .status(500)
      .json({ message: "An error occurred while creating the user." });
  }
};

export const updateUser = async (req, res) => {
  const { body, params } = req;
  const id = params.id;
  try {
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const validator = updateUserSchema();
    const { error, value } = validator.validate(body);
    if (error) {
      return res.status(400).json({ message: error.details });
    }
    const { email } = value;

    user.email = email;
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error(error, "this error");
    return res.status(500).json({
      message: "An error occurred while updating the user",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { params } = req;
  const id = params.id;

  try {
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.deleteOne({ id });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error, "this error");
    return res.status(500).json({
      message: "An error occurred while deleting the user",
    });
  }
};

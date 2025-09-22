import * as userModel from "../models/userModel.js";

export async function registerUser(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing username or password" });

  try {
    const user = await userModel.createUser(username, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
}

export async function getUserById(req, res) {
  const user = await userModel.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export async function getAllUsers(req, res) {
  const users = await userModel.getAllUsers();
  res.json(users);
}

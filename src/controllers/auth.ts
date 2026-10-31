import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import mongoose from 'mongoose';

const now = new Date();
const getCurrentUser = ( req: Request, res: Response): void => {

res.status(200).json({
    success: true,
    data: {
      userId: "ilya_001",
      email: "ilyavale@example.com",
      name: "Ilya Vale",
      createdAt: `${now}`
    },
    error: null
})
};

const createNewUser = async (req: Request, res: Response): Promise<void> => {

  const { email, password, name } = req.body;

  if( !name || !email || !password ){
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'name, email, and password are required fields'}
    });
    return;
  }

  if( password.length < 8){
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'password must be at least 8 characters long'}
    });
    return;
  };
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({email, password: hashedPassword, name});
    res.status(201).json({
      success: true,
      data: { userId: user._id, email: user.email, name: user.name},
      error: null,
    })
  } catch (err: unknown) {
    if ( err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      res.status(409).json({
        success: false,
        data: null,
        error: {message: 'Email already in use'}
      });
      return;
  }
  throw err;
  }  
  console.log("User created successfully.");
}

const userLogIn = async (req: Request, res: Response): Promise<void> => {

  const { email, password } = req.body;

  if ( !email || !password ) {
    res.status(401).json({
      success: false,
      data: null,
      error: {message: 'email and password are required'}
    });
    return;
  }

  const user = await User.findOne({ email });
  if(!user) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Invalid email or password'}
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Invalid email or password'}
    });
    return;
  }

  const token = jwt.sign(
    { userId: user._id},
    process.env.JWT_SECRET!,
    { expiresIn: '14d'},
  );


console.log("Log In Successful");
  res.status(200).json({
    success: true,
    data: {
      token,
      user: { userId: user._id, email: user.email, name: user.name }
    },
    error: null
  });
};

export { getCurrentUser, createNewUser, userLogIn };
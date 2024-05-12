// pages/api/quotes.ts

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb'; // Update the path to your MongoDB setup file
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const usersCollection = db.collection('users');
  
      const data = await req.json();
  
      // Check if all required keys are present
      const requiredKeys = [
        'name',
        'email',
        'password',
      ];
      const missingKeys = requiredKeys.filter(key => !(key in data));
      if (missingKeys.length > 0) {
        return NextResponse.json({ message: `Missing required keys: ${missingKeys.join(', ')}` }, { status: 400 });
      }
  
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: data['email'] });
      if (existingUser) {
        return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(data['password'],10)
  
      // If user doesn't exist, proceed with insertion
      const result = await usersCollection.insertOne({
        name: data['name'],
        email: data['email'],
        password: hashedPassword
      });
  
      return NextResponse.json({ message: 'User added successfully', user: result }, { status: 201 });
    } catch (error) {
      console.error('Error adding user:', error);
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  
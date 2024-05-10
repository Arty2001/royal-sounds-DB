// pages/api/quotes.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb'; // Update the path to your MongoDB setup file

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const quotesCollection = db.collection('quotes');

    const quotes = await quotesCollection.find({}).toArray();

    return NextResponse.json(quotes, {status:200})
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({error}, {status:200})
  }
}

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const quotesCollection = db.collection('quotes');

    const data = await req.json();

    // Check if all required keys are present
    const requiredKeys = [
      'name',
      'homeAddress',
      'phoneNumber',
      'emailAddress',
      'eventType',
      'venueLocation',
      'eventDate',
      'eventStartTime',
      'eventEndTime',
      'eventDescription',
      'extras'
    ];
    const missingKeys = requiredKeys.filter(key => !(key in data));
    if (missingKeys.length > 0) {
      return NextResponse.json({ message: `Missing required keys: ${missingKeys.join(', ')}` }, { status: 400 });
    }

    // Validate extras object
    const extras = data['extras'];
    const extraKeys = Object.keys(extras);
    const validExtraKeys = ['speakers', 'basicLighting', 'dryIce', 'DMXLighting', 'Sparklers', 'Projectors', 'MC', 'PhotoBooth'];
    const invalidExtraKeys = extraKeys.filter(key => !validExtraKeys.includes(key));
    if (invalidExtraKeys.length > 0) {
      return NextResponse.json({ message: `Invalid extra keys: ${invalidExtraKeys.join(', ')}` }, { status: 400 });
    }

    // Validate data types of extra values
    const invalidExtraValues = extraKeys.filter(key => typeof extras[key] !== 'number');
    if (invalidExtraValues.length > 0) {
      return NextResponse.json({ message: `Invalid data types for extra values: ${invalidExtraValues.join(', ')}` }, { status: 400 });
    }

    // If all validations pass, proceed with insertion
    const result = await quotesCollection.insertOne({
      name: data['name'],
      homeAddress: data['homeAddress'],
      phoneNumber: data['phoneNumber'],
      emailAddress: data['emailAddress'],
      eventType: data['eventType'],
      venueLocation: data['venueLocation'],
      eventDate: data['eventDate'],
      eventStartTime: data['eventStartTime'],
      eventEndTime: data['eventEndTime'],
      eventDescription: data['eventDescription'],
      extras: data['extras'],
      createdAt: new Date(),
    });

    console.log({data})
    
    return NextResponse.json({ message: 'Quote added successfully', quote: result }, { status: 201 });
  } catch (error) {
    console.error('Error adding quote:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const quotesCollection = db.collection('quotes');

    const { id } = await req.json();

    const result = await quotesCollection.findOneAndDelete({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json({ message: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Quote deleted successfully', quote: result }, { status: 200 });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json({ message: 'Error deleting quote' }, { status: 500 });
  }
}


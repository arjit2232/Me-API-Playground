const mongoose = require('mongoose');
require('dotenv').config();

const Profile = require('./models/Profile');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/me_api_playground';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    await Profile.deleteMany({});

    const profile = await Profile.create({
      name: 'Arjit Tiwari',
      email: 'arjittiwari78@gmail.com',
      education: 'B.Tech in Computer Science And Engineering(AIML), GL Bajaj Group Of Inatitutions (2022 - 2026)',
      skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'React', 'REST APIs'],
      projects: [
        {
          title: 'Me-API Playground',
          description: 'A small backend + frontend playground exposing my candidate profile via a REST API.',
          links: ['https://github.com/arjit2232/Me-API-Playground.git']
        },
        {
          title: 'Airbnb-clone',
          description: 'Airbnb clone website which is developed on Model View Controller Architecture',
          links: ['https://github.com/arjit2232/Airbnb-clone']
        }
      ],
      workLinks: {
        github: 'https://github.com/arjit2232',
        linkedin: 'https://www.linkedin.com/in/arjit-tiwari-512b21264/',
        portfolio: 'https://github.com/arjit2232/Resume/blob/main/resume12012026.pdf'
      }
    });

    console.log('Seeded profile:', profile);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();


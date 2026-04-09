import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/Project.js';

dotenv.config();

const samples = [
  {
    title: 'E-Commerce Dashboard',
    description:
      'Admin dashboard for managing products, orders, and analytics. Built with React, Node, and MongoDB with role-based access.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
    githubLink: 'https://github.com',
    liveDemo: 'https://example.com',
  },
  {
    title: 'Task Collaboration App',
    description:
      'Real-time task boards with drag-and-drop, teams, and notifications. REST API with JWT auth and optimistic UI updates.',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80',
    technologies: ['React', 'Express', 'Socket.io', 'MongoDB'],
    githubLink: '',
    liveDemo: '',
  },
  {
    title: 'Portfolio CMS API',
    description:
      'Headless content API for portfolio projects with validation, pagination, and image hosting integration.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    technologies: ['Node.js', 'Express', 'Mongoose', 'Cloudinary'],
    githubLink: 'https://github.com',
    liveDemo: '',
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI required');
  await mongoose.connect(uri);
  const count = await Project.countDocuments();
  if (count > 0) {
    console.log('Projects already exist; skip seed. Delete projects to re-seed.');
    process.exit(0);
  }
  await Project.insertMany(samples);
  console.log('Seeded', samples.length, 'projects');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

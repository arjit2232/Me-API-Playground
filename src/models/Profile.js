const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    education: { type: String, required: true },
    skills: [{ type: String }],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        links: [{ type: String }]
      }
    ],
    workLinks: {
      github: { type: String },
      linkedin: { type: String },
      portfolio: { type: String }
    }
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

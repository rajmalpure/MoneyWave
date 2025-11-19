/**
 * Database Migration Script
 * 
 * This script adds username field to existing users in the database.
 * Run this ONCE before deploying the new code to production.
 * 
 * Usage:
 * 1. Connect to your MongoDB database
 * 2. Run this script in MongoDB shell or using Node.js
 */

// Option 1: MongoDB Shell
// Copy and paste this into your MongoDB shell:

db.users.find({ username: { $exists: false } }).forEach(function(user) {
  const username = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  // Check if username already exists
  const existing = db.users.findOne({ username: username });
  
  if (existing && !existing._id.equals(user._id)) {
    // If username exists, append user ID to make it unique
    const uniqueUsername = username + '_' + user._id.toString().substring(0, 6);
    db.users.updateOne(
      { _id: user._id },
      { $set: { username: uniqueUsername } }
    );
    print('Updated user ' + user.email + ' with username: ' + uniqueUsername);
  } else {
    db.users.updateOne(
      { _id: user._id },
      { $set: { username: username } }
    );
    print('Updated user ' + user.email + ' with username: ' + username);
  }
});

print('Migration completed!');


// Option 2: Node.js Script
// Save this as migrate-users.js and run with: node migrate-users.js

/*
import 'dotenv/config';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const usersWithoutUsername = await User.find({ username: { $exists: false } });
    console.log(`Found ${usersWithoutUsername.length} users without username`);

    for (const user of usersWithoutUsername) {
      let username = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
      
      // Check if username exists
      let existing = await User.findOne({ username });
      
      if (existing && !existing._id.equals(user._id)) {
        // Make it unique
        username = `${username}_${user._id.toString().substring(0, 6)}`;
      }
      
      user.username = username;
      await user.save();
      console.log(`✓ Updated ${user.email} → ${username}`);
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();
*/


// Option 3: Direct MongoDB Compass or Atlas
// 1. Go to your MongoDB database
// 2. Select the 'users' collection
// 3. Click on "Aggregation"
// 4. Use this pipeline:

/*
[
  {
    $match: {
      username: { $exists: false }
    }
  },
  {
    $set: {
      username: {
        $toLower: {
          $arrayElemAt: [
            { $split: ["$email", "@"] },
            0
          ]
        }
      }
    }
  },
  {
    $merge: {
      into: "users",
      whenMatched: "merge"
    }
  }
]
*/


// Verification Query
// After migration, verify all users have usernames:

db.users.find({ username: { $exists: false } }).count();
// Should return 0

// Check for duplicates:
db.users.aggregate([
  { $group: { _id: "$username", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
]);
// Should return empty array

# Group Transactions Feature - Setup Guide

## 📋 Overview

The Group Transactions module has been successfully implemented! This feature allows users to:
- Create groups for shared expenses
- Invite members by username
- Track group expenses with flexible split options (equal/custom)
- View real-time balances showing who owes what
- Manage invitations (accept/reject)

---

## 🚀 What Was Added

### Backend (Server)

#### **New Models** (`server/src/models/`)
1. **Group.js** - Stores group information with members
2. **GroupInvitation.js** - Manages pending/accepted/rejected invitations
3. **GroupTransaction.js** - Tracks shared expenses with split details
4. **Updated User.js** - Added `username` field (required, unique, indexed)

#### **New Controller** (`server/src/controllers/`)
- **groupController.js** - Complete CRUD operations for:
  - Groups (create, read, update, delete, leave)
  - Invitations (send, accept, reject, list)
  - Transactions (create, read, delete)
  - Balances (calculate who owes what)

#### **New Routes** (`server/src/routes/`)
- **groupRoutes.js** - All group-related endpoints with validation

#### **Updated Files**
- `server/src/app.js` - Registered `/groups` routes
- `server/src/controllers/authController.js` - Added username to registration
- `server/src/routes/authRoutes.js` - Added username validation

---

### Frontend (Client)

#### **New Pages** (`client/src/pages/`)
1. **Groups.jsx** - Main groups listing page
2. **CreateGroup.jsx** - Create new group with member invitations
3. **GroupDetails.jsx** - View group transactions and balances
4. **Invitations.jsx** - View and manage pending invitations

#### **New Components** (`client/src/components/groups/`)
1. **GroupCard.jsx** - Display group summary in list
2. **AddMemberModal.jsx** - Modal to invite new members
3. **InvitationCard.jsx** - Display invitation with accept/reject buttons
4. **GroupTransactionForm.jsx** - Add group expenses with split options

#### **Updated Files**
- `client/src/App.jsx` - Added group routes
- `client/src/components/layout/Sidebar.jsx` - Added "Group Transactions" menu item
- `client/src/pages/Signup.jsx` - Added username field
- `client/src/index.css` - Added animation styles

---

## 🔧 Setup Instructions

### 1. **Important: Update Existing Users**

Since we added a `username` field to the User model, existing users in your database need to be updated. Run this in your MongoDB shell or create a migration script:

```javascript
// MongoDB shell command
db.users.updateMany(
  { username: { $exists: false } },
  [{ $set: { username: { $toLower: "$email" } } }]
);

// Or create unique usernames from email
db.users.find({ username: { $exists: false } }).forEach(function(user) {
  db.users.updateOne(
    { _id: user._id },
    { $set: { username: user.email.split('@')[0].toLowerCase() } }
  );
});
```

### 2. **Install Dependencies** (if needed)

```bash
# Server dependencies should already be installed
cd server
npm install

# Client dependencies should already be installed
cd ../client
npm install
```

### 3. **Environment Variables**

Ensure your `.env` files are properly configured:

**Server** (`server/.env`):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URLS=http://localhost:5173,https://your-deployed-frontend.com
```

**Client** (`client/.env`):
```env
VITE_API_URL=https://moneywave-1.onrender.com
```

### 4. **Deploy to Production**

#### **Deploy Backend (Render.com)**
```bash
# Commit all changes
git add .
git commit -m "Add Group Transactions feature"
git push origin main
```

Then:
1. Go to Render.com dashboard
2. Find your `moneywave-1` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete (~2-5 minutes)

#### **Deploy Frontend (Vercel)**
Your frontend should auto-deploy if connected to GitHub, or manually:
```bash
cd client
npm run build
# Deploy the dist folder
```

---

## 📱 How to Use

### For Users

1. **Create Account with Username**
   - Sign up with name, username, email, and password
   - Username must be unique and at least 3 characters

2. **Create a Group**
   - Navigate to "Group Transactions" in sidebar
   - Click "Create Group"
   - Add group name, description, and member usernames
   - Members will receive invitations

3. **Accept Invitations**
   - Check the "Invitations" button (shows count badge)
   - Accept or reject pending invitations
   - Accepted invitations add you to the group

4. **Add Group Expenses**
   - Open a group from the list
   - Click "Add Expense"
   - Fill in details:
     - Description, amount, who paid
     - Split type (equal or custom)
     - Select participants
     - Add category and notes

5. **View Balances**
   - Switch to "Balances" tab in group details
   - See who owes what
   - Green = gets money back
   - Red = owes money

---

## 🔗 API Endpoints

### Groups
- `POST /groups` - Create group
- `GET /groups` - Get user's groups
- `GET /groups/:id` - Get group details
- `PUT /groups/:id` - Update group
- `DELETE /groups/:id` - Delete group
- `POST /groups/:id/leave` - Leave group

### Invitations
- `POST /groups/invite` - Send invitation
- `GET /groups/invitations` - Get pending invitations
- `POST /groups/invitations/:id/accept` - Accept invitation
- `POST /groups/invitations/:id/reject` - Reject invitation

### Transactions
- `POST /groups/:groupId/transactions` - Create transaction
- `GET /groups/:groupId/transactions` - Get all transactions
- `GET /groups/:groupId/balances` - Get balances
- `DELETE /groups/:groupId/transactions/:transactionId` - Delete transaction

---

## ✅ Testing Checklist

- [ ] New users can register with username
- [ ] Existing users can log in
- [ ] Can create a group
- [ ] Can invite members by username
- [ ] Invitations appear in receiver's inbox
- [ ] Can accept/reject invitations
- [ ] Can add group expenses
- [ ] Equal split calculates correctly
- [ ] Custom split validates amounts
- [ ] Balances calculate correctly
- [ ] Can delete own transactions
- [ ] Can leave a group (non-creator)
- [ ] Creator can delete group
- [ ] UI is responsive on mobile

---

## 🎨 Features Highlights

✨ **Modern UI**
- Animated modals and transitions
- Color-coded balances (green/red)
- Responsive design for all devices

✨ **Smart Split Calculation**
- Equal split divides automatically
- Custom split with validation
- Real-time balance updates

✨ **Secure & Validated**
- Username-based invitations
- Member-only access to groups
- Creator-only deletion rights

✨ **User-Friendly**
- Invitation count badges
- Clear balance summaries
- Easy member management

---

## 🐛 Troubleshooting

### Issue: "Username already taken"
- Usernames must be unique
- Try a different username during signup

### Issue: "User not found" when inviting
- User must have an account first
- Check username spelling (case-insensitive)

### Issue: Split amounts don't match
- For custom splits, total must equal transaction amount
- Form won't submit until amounts match

### Issue: Can't see groups after accepting invitation
- Refresh the groups list
- Check if you're still logged in

---

## 📝 Notes

- All monetary amounts are in USD
- Dates are in user's local timezone
- Group creators cannot leave (must delete group)
- Invitations expire when group is deleted
- Transaction history is preserved until manually deleted

---

## 🎉 Success!

Your Group Transactions feature is now fully integrated! Users can now:
- 👥 Share expenses with friends and family
- 💰 Track who owes what in real-time
- 📊 Split bills fairly and easily
- 🔔 Get notified of group invitations

Enjoy your enhanced Money Manager app! 🚀

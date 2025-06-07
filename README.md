# Accounts Balance Viewer

A modern Angular application for viewing and managing account balances with Auth0 authentication and role-based access control.

## Features

- 🔐 **Auth0 Authentication** - Secure login and signup
- 👥 **Role-Based Access Control** - Admin and User roles
- 📊 **Balance Viewing** - View current account balances (All users)  
- 📤 **File Upload** - Upload balance data files (Admin only)
- 📈 **Reports & Analytics** - View reports and export data (Admin only)
- 🎨 **Modern UI** - Beautiful, responsive design
- 🚀 **Built with Angular 19** - Latest Angular features

## User Roles

### Regular Users
- View account balances
- Access to balance overview page

### Admin Users  
- All regular user permissions
- Upload balance data files (CSV, Excel)
- View reports and analytics
- Export data in multiple formats

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Auth0 account and application setup

## Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new Single Page Application
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:4200`
   - **Allowed Logout URLs**: `http://localhost:4200`
   - **Allowed Web Origins**: `http://localhost:4200`

4. Create roles in Auth0 Dashboard:
   - Go to User Management > Roles
   - Create "admin" role
   - Create "user" role (optional, as this is the default)

5. Create a rule/action to add roles to tokens:
   ```javascript
   exports.onExecutePostLogin = async (event, api) => {
     const namespace = 'https://yourapp.com/';
     if (event.authorization) {
       api.idToken.setCustomClaim(`${namespace}roles`, event.user.app_metadata?.roles || ['user']);
     }
   };
   ```

6. Update `src/app/auth/auth.config.ts` with your Auth0 credentials

## Installation

1. Install dependencies: `npm install`
2. Update Auth0 configuration in `src/app/auth/auth.config.ts`
3. Start the development server: `npm start`
4. Open [http://localhost:4200](http://localhost:4200) in your browser

## Usage

### For Regular Users
1. Sign up or login through Auth0
2. View account balances on the main page

### For Admin Users
1. Login with admin role assigned in Auth0
2. Access upload and reports features

### Assigning Admin Role

To make a user an admin:
1. Go to Auth0 Dashboard > User Management > Users
2. Select the user
3. Go to the "app_metadata" section
4. Add: `{"roles": ["admin"]}`
5. Save changes

# TaskLane Frontend

A modern, responsive React-based frontend for TaskLane, a collaborative task management and kanban board application. Built with Vite, Tailwind CSS, and Redux for state management.

## Overview

TaskLane Frontend provides an intuitive user interface for managing tasks, organizing work with kanban boards, collaborating with team members, and tracking project progress. Features include real-time updates, dark mode support, and a responsive design that works seamlessly across devices.

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite (with Rolldown)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Redux Toolkit 2.11.2
- **Routing**: React Router DOM 7.9.2
- **Authentication**: Clerk React 5.49.0
- **UI Components**: Radix UI
- **Icons**: Lucide React 0.544.0
- **Notifications**: Sonner 2.0.7
- **Theme**: Next Themes 0.4.6

## Project Structure

```
fe/
├── src/
│   ├── components/
│   │   ├── AppSidebar.jsx              # Main sidebar navigation
│   │   ├── BoardMembersDialog.jsx      # Team member management
│   │   ├── DashboardHeader.jsx         # Dashboard header component
│   │   ├── NotificationPanel.jsx       # Notifications display
│   │   ├── CTA.jsx                     # Call-to-action components
│   │   ├── Features.jsx                # Feature showcase
│   │   ├── Footer.jsx                  # Footer component
│   │   ├── Hero.jsx                    # Hero section
│   │   ├── Navbar.jsx                  # Navigation bar
│   │   └── ui/                         # Reusable UI components
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── separator.jsx
│   │       ├── sheet.jsx
│   │       ├── sidebar.jsx
│   │       ├── skeleton.jsx
│   │       ├── sonner.jsx
│   │       ├── textarea.jsx
│   │       └── tooltip.jsx
│   ├── layouts/
│   │   ├── root.layout.jsx             # Root layout wrapper
│   │   ├── main.layout.jsx             # Main public layout
│   │   └── protected.layout.jsx        # Protected routes layout
│   ├── pages/
│   │   ├── landing.page.jsx            # Landing page
│   │   ├── about.page.jsx              # About page
│   │   ├── dashboard.page.jsx          # Main dashboard
│   │   ├── kanbanboard.page.jsx        # Kanban board view
│   │   ├── calendar.page.jsx           # Calendar view
│   │   ├── team.page.jsx               # Team management
│   │   ├── settings.page.jsx           # User settings
│   │   ├── sign-in.page.jsx            # Sign in page
│   │   ├── sign-up.page.jsx            # Sign up page
│   │   └── quick-action.page.jsx       # Quick action filters
│   ├── lib/
│   │   ├── api.js                      # API client configuration
│   │   ├── store.js                    # Redux store setup
│   │   ├── utils.js                    # Utility functions
│   │   └── features/
│   │       ├── filterSlice.js          # Filter state management
│   │       └── searchSlice.js          # Search state management
│   ├── hooks/
│   │   └── use-mobile.jsx              # Mobile detection hook
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx                         # Main app component
│   ├── App.css                         # App styles
│   ├── index.css                       # Global styles
│   └── main.jsx                        # React entry point
├── public/
│   ├── _redirects                      # Netlify redirects
│   └── vite.svg
├── package.json
├── vite.config.js
├── tailwind.config.js
├── jsconfig.json
├── postcss.config.js
├── eslint.config.js
├── components.json                     # Shadcn/ui config
├── index.html
└── .env                                # Environment variables
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Clerk account for authentication

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `fe` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   VITE_API_BASE_URL=<your-backend-api-url>
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- **`npm run dev`** - Start development server with hot module replacement
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint to check code quality

## Features

### Authentication
- Secure sign-in and sign-up with Clerk
- Protected routes for authenticated users
- Session management

### Dashboard
- Overview of all tasks and boards
- Quick statistics and summaries
- Recent activity feed

### Kanban Board
- Drag-and-drop task management
- Multiple columns for workflow stages
- Card details and editing
- Task assignment and priority management

### Calendar View
- Visual task scheduling
- Due date management
- Event-based task organization

### Team Collaboration
- Board member management
- Team member invitations
- Role-based access control
- Comments and discussions on tasks

### Notifications
- Real-time activity notifications
- Notification preferences
- Notification history

### Quick Actions
- Filter tasks by status (New, In Progress, Completed)
- Filter tasks by due date (Due Soon)
- Quick task creation

### Settings
- User profile management
- Preferences and theme selection
- Account settings

## Routing

The application uses React Router with the following route structure:

### Public Routes
- `/` - Landing page
- `/about` - About page
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page

### Protected Routes (Requires Authentication)
- `/dashboard` - Main dashboard
- `/kanban` - Kanban board
- `/calendar` - Calendar view
- `/team` - Team management
- `/settings` - User settings
- `/new-task` - New tasks filter
- `/in-progress` - In-progress tasks filter
- `/completed` - Completed tasks filter
- `/due-soon` - Due soon tasks filter

## State Management

### Redux Store
The application uses Redux Toolkit for state management with the following slices:

- **filterSlice** - Manages task filtering state
- **searchSlice** - Manages search functionality

Access the store in components using:
```javascript
import { useSelector, useDispatch } from 'react-redux';
```

## API Integration

The frontend communicates with the backend API through [`fe/src/lib/api.js`](fe/src/lib/api.js). Configure the API base URL in your `.env` file.

### API Client Features
- Automatic request/response handling
- Error handling and logging
- Authentication token management

## Styling

### Tailwind CSS
The project uses Tailwind CSS for utility-first styling with custom configuration in [`fe/tailwind.config.js`](fe/tailwind.config.js).

### Dark Mode
Dark mode support is implemented using Next Themes. Toggle dark mode in the application settings.

### UI Components
Reusable UI components are built with Radix UI primitives and styled with Tailwind CSS. Located in [`fe/src/components/ui/`](fe/src/components/ui/).

## Development

### Code Organization

- **Pages** - Full page components for routes
- **Layouts** - Layout wrappers for different route groups
- **Components** - Reusable UI components
- **Lib** - Utilities, API client, and store configuration
- **Hooks** - Custom React hooks

### Adding New Features

1. Create page component in `src/pages/`
2. Add route in [`fe/src/App.jsx`](fe/src/App.jsx)
3. Create reusable components in `src/components/`
4. Add state management in Redux if needed
5. Style with Tailwind CSS

### Component Best Practices

- Use functional components with hooks
- Keep components small and focused
- Use Redux for global state
- Use local state for component-specific data
- Leverage Radix UI for accessible components

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deploy to Netlify

The project includes a `_redirects` file for Netlify SPA routing. Simply connect your repository to Netlify and it will automatically build and deploy.

### Environment Variables for Production

Ensure these environment variables are set in your deployment platform:
- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Vite provides fast development and optimized production builds
- Code splitting for better load times
- Lazy loading of routes
- Optimized bundle size with tree-shaking

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Run `npm run lint` to check code quality
5. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue in the repository.

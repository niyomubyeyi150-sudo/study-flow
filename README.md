
# HubNest

**A personal workspace for organizing tasks, building study habits, and staying focused.**

HubNest is a responsive productivity web application built with React. It brings task management, study planning, and focus sessions together in one simple workspace.

The goal of HubNest is to help students organize their daily responsibilities, track their progress, and create a more focused study routine.

## Features

### Dashboard
- View an overview of your tasks.
- Track completed and pending tasks.
- Monitor task completion progress.
- View upcoming tasks.

### Task Management
- Add new tasks.
- Edit existing tasks.
- Delete tasks.
- Mark tasks as completed or pending.
- Search for tasks.
- Filter and sort tasks.
- Set task priorities.

### Focus Timer
- Start, pause, resume, and reset a focus session.
- Switch between Study and Break sessions.
- Customize study session duration through Settings.
- View timer progress.

### Settings
- Set your display name.
- Choose your preferred study duration.
- Enable or disable Compact Mode.
- Save or restore your preferences.

## Technologies Used

- **React 19** – Building the user interface with reusable components.
- **Vite** – Development server and build tool.
- **Tailwind CSS v4** – Responsive styling and layout.
- **React Router DOM** – Navigation between application pages.
- **JavaScript (ES6+)** – Application logic and interactions.
- **Local Storage** – Persisting tasks and user preferences in the browser.
- **React Hooks** – Managing state, side effects, and reusable logic.

## Project Structure

```text
study-flow/
├── public/
├── src/
│   ├── assets/
│   ├── context/
│   │   └── TasksContext.jsx
│   ├── data/
│   │   └── initialTasks.js
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   ├── useDocumentTitle.js
│   │   ├── useLocalStorage.js
│   │   └── useToggle.js
│   ├── layouts/
│   │   └── SiteLayout.jsx
│   ├── pages/
│   │   ├── DashboardPage.jsx
│   │   ├── FocusPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── TasksPage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

Follow these steps to run HubNest locally.

### 1. Clone the repository

```bash
git clone https://github.com/niyomubyeyi150-sudo/study-flow.git
```

### 2. Navigate into the project

```bash
cd study-flow
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to view HubNest in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run preview` | Previews the production build |
| `npm run lint` | Runs ESLint to check the code |

## Custom React Hooks

HubNest uses custom hooks to keep application logic reusable and organized.

| Hook | Purpose |
|---|---|
| `useLocalStorage` | Saves and retrieves values from browser local storage |
| `useToggle` | Manages boolean state |
| `useDocumentTitle` | Updates the browser tab title |
| `useDebounce` | Delays updates until the user stops typing |

## State Management

HubNest uses React Context to share task data across pages.

- **TasksContext:** Provides shared task state to components that need access to tasks.
- **useState:** Manages local component state, such as form inputs and timer controls.
- **useEffect:** Handles side effects, including document title updates and timer behavior.
- **useRef:** Keeps references needed by the focus timer.
- **Local Storage:** Preserves tasks and user preferences between browser sessions.

## React Compiler

The project includes the React Compiler through the Babel plugin configured in Vite.

The compiler can automatically optimize component rendering and reduce the need for manually adding `useMemo` and `useCallback` in ordinary cases.

## Future Improvements

- Make Compact Mode affect the layout across all pages.
- Add more personalization options.
- Improve the focus timer with additional session preferences.
- Add more productivity insights to the dashboard.

## Author

Developed as a React learning project.

**Project:** HubNest  
**Repository:** [GitHub – HubNest](https://github.com/niyomubyeyi150-sudo/study-flow)

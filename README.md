

# SILVER Authentication

![Project Demo](https://storage.googleapis.com/aistudio-o-images/project_screenshots/silver-auth-demo.gif)

A modern, animated authentication page with a dynamic star trail background and light/dark theme support. Designed for a premium user experience, this project serves as a sleek, reusable front-end for any application requiring user login and registration.

## ✨ Key Features

-   **Dynamic Animated Background**: A captivating star trail animation that adds a futuristic and premium feel.
-   **Light & Dark Mode**: A smooth, persistent theme switcher that respects user preference.
-   **Modern UI/UX**: Clean, minimalist design with fluid animations and transitions.
-   **Session Persistence**: Remembers logged-in users for a seamless "Welcome Back" experience.
-   **Responsive Design**: A fully responsive layout that looks great on all screen sizes, from mobile to desktop.
-   **Component-Based Architecture**: Built with React, making it easy to understand, customize, and extend.

## 🛠️ Tech Stack

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
-   **AI Integration**: [Google Gemini AI](https://ai.google.dev/)
-   **Fonts**: [Google Fonts](https://fonts.google.com/) (Poppins & Orbitron)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd silver-authentication
    ```

2.  **Install dependencies:**
    This project uses `npm` to manage its dependencies.
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    The project uses the Google Gemini API for certain features. You'll need to create an environment file to store your API key.

    -   Create a new file named `.env.local` in the root of the project.
    -   Add your Gemini API key to this file:
        ```
        GEMINI_API_KEY="YOUR_API_KEY"
        ```
    > You can get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    This command will start the Vite development server, typically on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

The application should now be running in your browser!

## 📜 Available Scripts

In the project directory, you can run the following commands:

-   `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
-   `npm run build`: Bundles the app into static files for production in the `dist` folder.
-   `npm run preview`: Starts a local server to preview the production build.

## 📂 Project Structure

The project is organized with a focus on clarity and scalability. Here is a brief overview of the key directories and files:

```
/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components (AuthForm, StarCanvas, etc.)
│   ├── hooks/            # Custom React hooks (e.g., useTheme)
│   ├── App.tsx           # Main application component and logic
│   ├── index.tsx         # React entry point
│   └── index.css         # Global styles
├── .env.local            # Environment variables (you need to create this)
├── index.html            # Main HTML file with CDN links
├── package.json          # Project dependencies and scripts
└── README.md             # You are here!
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

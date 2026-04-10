# Month Magic Calendar

A beautiful, customizable wall calendar application built with React and TypeScript. Users can navigate through months, view dates, and personalize their calendar by uploading custom images for each month.

## Features

- **Calendar Navigation**: Easily switch between months using intuitive navigation buttons.
- **Custom Month Images**: Upload your own images to personalize the calendar view for each month.
- **Image Management**: Restore default images or keep custom ones across sessions (stored in `localStorage`).
- **Responsive Design**: Beautiful interface that adapts to different screen sizes.
- **Modern UI**: Built with Shadcn UI components for a premium look and feel.

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Utilities**: Date-fns
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd month-magic-calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Usage

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Design & Architecture Choices

- **Client-Side Storage**: `localStorage` is used strategically for persisting user customizations (custom month images) and task notes. This keeps the application fast, personalized, and fully functional as a standalone client-side app.
- **Tailwind CSS for Deep Customization**: Tailwind enables the precise execution of visual priorities, such as glassmorphism, dynamic glowing drop shadows, and scale micro-animations on hover interactions to create a premium, tactile feel.
- **Robust Date Management via Date-fns**: To maintain the complex matrix calculations needed for plotting a multi-week calendar grid properly, `date-fns` was chosen to compute precise month, week, and range boundaries gracefully while keeping bundle sizes lean.
- **Lucide React Icons**: Included to provide sleek, crisp, and consistent iconography without bloat.

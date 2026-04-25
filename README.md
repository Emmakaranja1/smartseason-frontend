# 🌱 SmartSeason Field Monitoring System — Frontend

A modern, UI-focused React application for tracking crop progress across multiple fields during a growing season.

Designed with a strong emphasis on **user experience, interactivity, and clean visual systems**, enabling efficient coordination between Admins and Field Agents.

---

## 🚀 Overview

SmartSeason Frontend delivers an intuitive and responsive interface for:

* Admin (Coordinator) users
* Field Agents

It connects to a RESTful backend API to manage fields, track updates, and visualize agricultural progress through interactive dashboards and components.

---

## 🧭 Architecture Flow

This project follows a clear unidirectional flow:

```
Component → Zustand Store → Axios API Layer → Backend
```

* **Components** handle UI & user interactions
* **Zustand Store** manages global client state
* **Axios API Layer** handles HTTP communication
* **Backend** processes and persists data

This separation ensures scalability, maintainability, and predictable data flow.

---

## 🎯 Core Features

### 1. 🔐 Authentication & Access Control

* JWT-based authentication
* Role-based access:

  * Admin (Coordinator)
  * Field Agent
* Protected routes using React Router
* Persistent login using localStorage (via Zustand persist middleware)

---

### 2. 🌾 Field Management (Admin)

Admins can:

* Create new fields
* Assign fields to agents
* View all fields
* Update field details
* Delete fields

Each field includes:

* Name
* Crop type
* Planting date
* Current stage

---

### 3. 📝 Field Updates (Agents)

Field Agents can:

* Update field stage
* Add observations/notes
* Track field progress over time

---

### 4. 🌱 Field Stages

Lifecycle supported:

* Planted
* Growing
* Ready
* Harvested

---

### 5. ⚙️ Field Status Logic (UI Display)

Fields display computed status:

* 🟢 Active → recently updated & progressing
* 🟠 At Risk → no updates or delayed growth
* ⚫ Completed → harvested

Status is derived from backend response and visually represented using badges and progress components.

---

### 6. 📊 Dashboards

#### Admin Dashboard

* Total fields
* Active fields
* At risk fields
* Completed fields
* Fields per agent
* Agent activity overview

#### Field Agent Dashboard

* Assigned fields
* Status breakdown
* At-risk fields requiring attention
* Recent updates

---

## 🎨 UI & INTERACTIVITY (CORE FOCUS)

This frontend is designed as a **component-driven UI system**, prioritizing usability and visual clarity.

---

### 🧩 Component System

Built using **shadcn/ui (New York style)**:

* Accessible, composable components based on Radix UI
* Located in: `src/components/ui/`

Core components used:

* Button, Card, Dialog, Table, Input
* Dropdowns, Modals, and interactive primitives

---

### 🌿 Design System

* Tailwind CSS v4 with semantic design tokens
* Custom theme defined in `src/styles.css`
* Uses OKLCH color system for better visual balance

#### Theme Palette

* 🌱 Primary: Deep leaf green
* 🌾 Accent: Warm harvest amber
* ⚪ Neutral: Soft earthy tones

---

### ⚡ Custom UI Components

Built on top of shadcn:

* `StatusBadge` → field status indicator
* `StageProgress` → lifecycle progression indicator
* `FieldCard` → compact field overview
* `StatCard` → dashboard metrics
* `AppLayout` → shared layout with navigation

---

### 🔔 User Feedback & Interactions

* Toast notifications via Sonner
* Immediate UI feedback on actions (create/update/delete)
* Loading states and error handling
* Clean form interactions

---

### 🧭 Routing Experience

* React Router v6+ (nested routes)
* Layout-based route structure
* Protected routes for authenticated access

---

### 🎯 UX Principles

* Clear visual hierarchy
* Minimal cognitive load
* Action-driven UI
* Responsive across devices
* Optimistic UI updates where applicable

---

## 🛠️ Tech Stack

* ⚛️ React (Vite)
* 🟦 TypeScript
* 🧠 Zustand (state management)
* 🌐 Axios (API layer)
* 🎨 Tailwind CSS v4
* 🧩 shadcn/ui (Radix UI)
* 🔔 Sonner (toasts)
* 🧭 React Router
* 🎯 Lucide React (icons)

---

## 📁 Project Structure

```
src/
├── api/            # Axios instance + endpoints
├── store/          # Zustand stores
├── app/            # App bootstrap
├── features/       # Domain logic modules
├── components/
│   ├── ui/         # shadcn components
│   └── custom/     # app-specific components
├── pages/          # Route pages
├── layouts/        # Layout components
├── hooks/          # Custom hooks
├── utils/          # helpers
├── types/          # TypeScript types
└── styles.css
```

---

## 🌐 API Integration

Base URL:

```
https://smartseason-api-u3c1.onrender.com
```

Main endpoints:

* `/auth/login`
* `/auth/logout`
* `/fields`
* `/fields/:id/updates`
* `/dashboard/admin`
* `/dashboard/agent`

---

## 🧠 State Management (Zustand)

Stores:

* `authStore` → authentication state & session
* `fieldStore` → field data & operations
* `dashboardStore` → analytics & summaries

Features:

* Lightweight global state
* Middleware support (persist, devtools)
* Direct action-based updates

---

## 🌐 API Layer (Axios)

Centralized HTTP client:

* Base instance with interceptors
* JWT token injection
* Error normalization
* Feature-based API modules

---

## 📦 Installation

```bash
npm install
```

---

## 🚀 Running the App

```bash
npm run dev
```

---

## 🔐 Environment Variables

```
VITE_API_URL=https://smartseason-api-u3c1.onrender.com/
```

---

## 🧠 Design Decisions

* Component-first architecture using shadcn/ui
* Zustand for minimal and scalable state management
* Axios abstraction layer for clean API handling
* React Router for flexible routing system
* Strict separation: UI → Store → API → Backend

---



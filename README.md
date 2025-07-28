# Order Management View

A full-stack order management application with React (Vite + TypeScript + Tailwind CSS) frontend and Node.js + Express backend.

## Features
- View, add, edit (inline), and delete orders
- Responsive, modern UI with Tailwind CSS
- Country dropdown auto-populated from backend data
- Single command to run both frontend and backend

## Project Structure
```
order-management-view/
├── backend/    # Express API (mock data)
├── frontend/   # React + Vite + Tailwind UI
├── package.json (root, for concurrent dev)
├── .gitignore
├── README.md
```

## Getting Started

### 1. Install dependencies
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Run the app (from project root)
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3001](http://localhost:3001)

## API Endpoints
- `GET /orders` – List all orders
- `POST /orders` – Add order
- `PUT /orders/:id` – Edit order
- `DELETE /orders/:id` – Delete order
- `GET /countries` – List unique countries

## Customization
- Edit sample data in `backend/server.js`
- Add more fields or validation as needed

---

Built with ❤️ using React, Vite, Tailwind CSS, Node.js, and Express. 
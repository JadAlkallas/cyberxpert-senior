
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add some test data for pending users
const pendingUsers = localStorage.getItem("cyberxpert-pending-users");
if (!pendingUsers) {
  const testData = [
    {
      id: "test123",
      username: "testdev",
      email: "testdev@example.com",
      role: "Dev",
      createdAt: new Date().toISOString()
    }
  ];
  localStorage.setItem("cyberxpert-pending-users", JSON.stringify(testData));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

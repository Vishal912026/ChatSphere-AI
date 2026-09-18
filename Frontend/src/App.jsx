import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./ChatPage.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
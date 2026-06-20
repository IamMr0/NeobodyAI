import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AIChatbot from './pages/AIChatbot';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutBuilder from './pages/WorkoutBuilder';
import Nutrition from './pages/Nutrition';
import BodyAnalysis from './pages/BodyAnalysis';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/analysis" replace />} />
              <Route path="analysis" element={<BodyAnalysis />} />
              <Route path="nutrition" element={<Nutrition />} />
              <Route path="library" element={<ExerciseLibrary />} />
              <Route path="builder" element={<WorkoutBuilder />} />
              <Route path="chat" element={<AIChatbot />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<ManageUsers />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

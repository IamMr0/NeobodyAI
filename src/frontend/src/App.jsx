import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AIChatbot from './pages/AIChatbot';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutBuilder from './pages/WorkoutBuilder';
import Nutrition from './pages/Nutrition';
import BodyAnalysis from './pages/BodyAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/analysis" replace />} />
          <Route path="analysis" element={<BodyAnalysis />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="library" element={<ExerciseLibrary />} />
          <Route path="builder" element={<WorkoutBuilder />} />
          <Route path="chat" element={<AIChatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

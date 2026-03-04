import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import FamilyLogin from './pages/family/FamilyLogin';
import FamilyDashboard from './pages/family/FamilyDashboard';
import QuestionBank from './pages/family/QuestionBank';
import ScheduleQuestion from './pages/family/ScheduleQuestion';
import ViewResponses from './pages/family/ViewResponses';
import Members from './pages/family/Members';
import FamilySettings from './pages/family/FamilySettings';
import ElderlyLogin from './pages/elderly/ElderlyLogin';
import DailyQuestion from './pages/elderly/DailyQuestion';
import SavedForLater from './pages/elderly/SavedForLater';
import History from './pages/elderly/History';
import ElderlySettings from './pages/elderly/ElderlySettings';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/family/login" element={<FamilyLogin />} />
        <Route path="/family/dashboard" element={<FamilyDashboard />} />
        <Route path="/family/question-bank" element={<QuestionBank />} />
        <Route path="/family/schedule" element={<ScheduleQuestion />} />
        <Route path="/family/responses" element={<ViewResponses />} />
        <Route path="/family/members" element={<Members />} />
        <Route path="/family/settings" element={<FamilySettings />} />
        <Route path="/elderly/login" element={<ElderlyLogin />} />
        <Route path="/elderly/daily-question" element={<DailyQuestion />} />
        <Route path="/elderly/saved" element={<SavedForLater />} />
        <Route path="/elderly/history" element={<History />} />
        <Route path="/elderly/settings" element={<ElderlySettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
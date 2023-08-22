import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Login }         from './components/Login';
import { Profile }       from './components/Profile';
import Messenger         from './pages/messenger/Messenger';
import RequireAuth       from './components/RequireAuth.jsx';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Messenger />} />

      <Route path="/login" element={<Login />} />

      <Route path="/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return <h1>404: Page Not Found</h1>;
}

export default App

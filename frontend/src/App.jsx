import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import AppRoutes from './routes/AppRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleProvider>
          <div className="min-h-screen bg-[#FDEBD0]">
            <AppRoutes />
          </div>
        </RoleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
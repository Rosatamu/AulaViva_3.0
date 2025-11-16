import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EnhancedActivityModule from './components/EnhancedActivityModule';
import EnhancedNutritionModule from './components/EnhancedNutritionModule';
import ProgressView from './components/ProgressView';
import EducationalCapsules from './components/EducationalCapsules';
import NutritionalStatus from './components/NutritionalStatus';
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';
import AulaCoinsSystem from './components/AulaCoinsSystem';
import CriptoAulaModule from './components/CriptoAulaModule';
import NutriBot from './components/NutriBot';
import DataManagement from './components/DataManagement';
import VideoLibrary from './components/VideoLibrary';
import ResearcherSection from './components/ResearcherSection';
import ForoDepartamental from './components/ForoDepartamental';
import SurveyModule from './components/SurveyModule';
import EmprendeQuindio from './components/EmprendeQuindio';
import AdminDashboard from './components/AdminDashboard';
import SessionOneDataView from './components/SessionOneDataView';
import { UserService } from './services/api';
import { supabase } from './lib/supabase';
import { UserData } from './types/User';
import { ProgressService } from './services/progressService';
import { RoleService } from './services/roleService';
import { unifiedUserService } from './services/unifiedUserService';

type ViewType = 'welcome' | 'dashboard' | 'activity' | 'nutrition' | 'progress' | 'education' | 'status' | 'profile' | 'coins' | 'criptoaula' | 'data' | 'videos' | 'researcher' | 'survey' | 'emprende' | 'foro' | 'admin' | 'session-one';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNutriBot, setShowNutriBot] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing session on app load ONLY for authenticated users
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        handleLogin(session.user.id, 'auth');
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        handleLogout();
      } else if (event === 'SIGNED_IN' && session?.user) {
        handleLogin(session.user.id, 'auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (userId: string, loginType: 'student' | 'auth' = 'student') => {
    setIsLoading(true);
    setError(null);

    try {
      let realUserData: UserData | null = null;

      if (loginType === 'student') {
        realUserData = await unifiedUserService.getUserByStudentId(userId);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          realUserData = await unifiedUserService.ensureUserProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          );
        }
      }

      if (!realUserData) {
        throw new Error('No se pudieron cargar los datos del usuario');
      }

      setUserData(realUserData);
      setIsLoggedIn(true);
      setCurrentView('dashboard');

      if (loginType === 'auth') {
        try {
          const userRole = await RoleService.getOrCreateUserRole(realUserData.id);
          setIsAdmin(userRole?.role === 'admin');
        } catch (roleError) {
          console.error('Error checking admin role:', roleError);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      if (realUserData.tipo_usuario === 'estudiante') {
        try {
          const migrationKey = `migrated_to_supabase_${userId}`;
          const alreadyMigrated = localStorage.getItem(migrationKey);

          if (!alreadyMigrated) {
            console.log('Migrando datos de localStorage a Supabase...');
            await ProgressService.migrateFromLocalStorage(userId);
            localStorage.setItem(migrationKey, 'true');
            console.log('Migración completada exitosamente');
          }
        } catch (migrationError) {
          console.error('Error durante la migración, pero continuando:', migrationError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    setUserData(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowWelcome(true); // Regresar a WelcomeScreen después del logout
    setCurrentView('welcome'); // Forzar vista welcome para corregir bug
    setError(null);
  };

  const renderCurrentView = () => {
    if (!userData) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard userData={userData} onNavigate={setCurrentView} onOpenNutriBot={() => setShowNutriBot(true)} />;
      case 'activity':
        return <EnhancedActivityModule userData={userData} setUserData={setUserData} onBack={() => setCurrentView('dashboard')} />;
      case 'nutrition':
        return <EnhancedNutritionModule userData={userData} setUserData={setUserData} onBack={() => setCurrentView('dashboard')} />;
      case 'progress':
        return <ProgressView userData={userData} onBack={() => setCurrentView('dashboard')} />;
      case 'coins':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-4 mb-8">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="w-10 h-10 bg-yellow-600 hover:bg-yellow-700 rounded-full flex items-center justify-center transition-colors"
                >
                  ←
                </button>
                <div>
                  <h1 className="text-3xl font-bold">Sistema AulaMonedas</h1>
                  <p className="text-yellow-300">Tu moneda virtual y recompensas</p>
                </div>
              </div>
              <AulaCoinsSystem userData={userData} />
            </div>
          </div>
        );
      case 'criptoaula':
        return <CriptoAulaModule userData={userData} onBack={() => setCurrentView('dashboard')} />;
      case 'education':
        return <EducationalCapsules onBack={() => setCurrentView('dashboard')} userData={userData} />;
      case 'status':
        return <NutritionalStatus userData={userData} onBack={() => setCurrentView('dashboard')} />;
      case 'profile':
        return (
          <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-4 mb-8">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
                >
                  ←
                </button>
                <div>
                  <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
                  <p className="text-purple-300">Información desde Supabase</p>
                </div>
              </div>
              <UserProfile userData={userData} />
            </div>
          </div>
        );
      case 'data':
        return <DataManagement onBack={() => setCurrentView('dashboard')} />;
      case 'videos':
        return <VideoLibrary onBack={() => setCurrentView('dashboard')} />;
      case 'researcher':
        return <ResearcherSection onBack={() => setCurrentView('dashboard')} />;
      case 'foro':
        return <ForoDepartamental onBack={() => setCurrentView('dashboard')} />;
      case 'survey':
        return <SurveyModule userData={userData} onBack={() => setCurrentView('dashboard')} />;
      case 'emprende':
        return <EmprendeQuindio userData={userData} onBack={() => setCurrentView('dashboard')} />;
      case 'admin':
        return isAdmin ? (
          <AdminDashboard onBack={() => setCurrentView('dashboard')} currentUserId={userData.id} />
        ) : (
          <div className="min-h-screen p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-2">Acceso Denegado</h2>
              <p className="text-gray-400">No tienes permisos de administrador</p>
            </div>
          </div>
        );
      case 'session-one':
        return <SessionOneDataView onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard userData={userData} onNavigate={setCurrentView} onOpenNutriBot={() => setShowNutriBot(true)} />;
    }
  };

  if (showWelcome && !isLoggedIn) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        isLoading={isLoading} 
        error={error} 
        onBack={() => setShowWelcome(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <Header
        userData={userData!}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />
      <main className="pt-20">
        {renderCurrentView()}
      </main>
      
      <NutriBot
        isOpen={showNutriBot}
        onClose={() => setShowNutriBot(false)}
        userData={userData!}
      />
    </div>
  );
}

export default App;
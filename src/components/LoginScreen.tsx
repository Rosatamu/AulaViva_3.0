import React, { useState } from 'react';
import { User, LogIn, Loader, AlertCircle, Star, Clock, UserPlus, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RoleService } from '../services/roleService';

interface LoginScreenProps {
  onLogin: (userId: string, loginType?: 'student' | 'auth') => void;
  isLoading: boolean;
  error: string | null;
  onBack?: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading, error, onBack }) => {
  const [loginMode, setLoginMode] = useState<'student' | 'public'>('student');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    onLogin(studentId.trim(), 'student');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (isSignUp && !username.trim())) return;

    if (!validateEmail(email.trim())) {
      setAuthError('Por favor ingresa un email válido (ejemplo: usuario@dominio.com)');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      let result;

      if (isSignUp) {
        result = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (result.data.user && !result.error) {
          try {
            await RoleService.createUserRole(
              result.data.user.id,
              'student',
              email.trim(),
              username.trim()
            );

            console.log('User profile and role created successfully');
          } catch (err) {
            console.error('Error inserting user data:', err);
            throw err;
          }
        }
      } else {
        result = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data.user) {
        onLogin(result.data.user.id, 'auth');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setAuthError(err.message || 'Error de autenticación');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Aula Viva
            </h1>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-6 border border-blue-500/20">
            <div className="flex items-center justify-center space-x-2 text-3xl font-mono text-blue-300 mb-2">
              <Clock className="w-6 h-6" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <p className="text-sm text-gray-400 capitalize">{formatDate(currentTime)}</p>
          </div>

          <p className="text-gray-300 text-lg mb-2">
            Aplicación Gamificada de Nutrición y Actividad Física
          </p>
          <p className="text-cyan-300 text-sm">
            IE Ramón Messa Londoño - Quimbaya
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Investigación: Antony Tabima Murillo, Magíster
          </p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
          {onBack && (
            <div className="mb-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors"
              >
                <span>←</span>
                <span>Volver a inicio</span>
              </button>
            </div>
          )}

          <div className="flex mb-6 bg-black/20 rounded-lg p-1">
            <button
              onClick={() => {
                setLoginMode('student');
                setAuthError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                loginMode === 'student'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Estudiante RML
            </button>
            <button
              onClick={() => {
                setLoginMode('public');
                setAuthError(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                loginMode === 'public'
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Usuario Público
            </button>
          </div>

          {loginMode === 'student' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Estudiantes IE RML
                </h2>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                  <p className="text-blue-300 text-sm font-medium">
                    Ingresa tu código de estudiante
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    Si eres estudiante de la IE Ramón Messa Londoño
                  </p>
                  <p className="text-cyan-400 text-xs mt-2 font-mono">
                    Códigos disponibles: 110, 111, 112
                  </p>
                </div>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 mb-2">
                    Código de Estudiante
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Ej: 110"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !studentId.trim()}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Ingresando...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Ingresar como Estudiante</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isSignUp ? <UserPlus className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mb-4">
                  <p className="text-cyan-300 text-sm font-medium">
                    {isSignUp ? 'Usa un email válido para registrarte' : 'Ingresa con tu email y contraseña'}
                  </p>
                  {isSignUp && (
                    <p className="text-cyan-200 text-xs mt-1">
                      Usuarios externos pueden explorar la plataforma
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                {isSignUp && (
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre de Usuario
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tu nombre de usuario"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                        disabled={authLoading || isLoading}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                      disabled={authLoading || isLoading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                      disabled={authLoading || isLoading}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center space-x-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{authError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading || isLoading || !email.trim() || !password.trim() || (isSignUp && !username.trim())}
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {(authLoading || isLoading) ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>{isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}</span>
                      </>
                    ) : (
                      <>
                        {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                        <span>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
                      </>
                    )}
                  </div>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError(null);
                      setUsername('');
                    }}
                    disabled={authLoading || isLoading}
                    className="text-cyan-300 hover:text-cyan-200 text-sm transition-colors disabled:opacity-50"
                  >
                    {isSignUp
                      ? '¿Ya tienes cuenta? Inicia sesión'
                      : '¿No tienes cuenta? Regístrate'
                    }
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">Sistema:</p>
              <p className="text-xs text-cyan-300 font-mono">
                Conectado a Supabase
              </p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Supabase Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

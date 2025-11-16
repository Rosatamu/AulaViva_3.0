import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Activity, TrendingUp, Database, BarChart3, FileText, Award, Download } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { ProgressService } from '../services/progressService';
import { RoleService, UserRole } from '../services/roleService';

interface AdminDashboardProps {
  onBack: () => void;
  currentUserId: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, currentUserId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalActivities: 0,
    totalSurveys: 0,
    avgProgress: 0,
    totalPoints: 0,
    activeUsers: 0
  });
  const [allUsers, setAllUsers] = useState<UserRole[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'users' | 'data'>('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const [students, users] = await Promise.all([
        supabaseService.getAllStudents(),
        RoleService.getAllUsers()
      ]);

      const completedActivitiesPromises = students.map(student =>
        ProgressService.getCompletedActivities(student.id_estudiante || '')
      );
      const allActivities = await Promise.all(completedActivitiesPromises);
      const totalActivitiesCount = allActivities.reduce((sum, acts) => sum + acts.length, 0);

      const progressPromises = students.map(student =>
        ProgressService.getOrCreateUserProgress(student.id_estudiante || '')
      );
      const allProgress = await Promise.all(progressPromises);
      const totalPoints = allProgress.reduce((sum, prog) => sum + (prog?.total_points || 0), 0);
      const avgProgress = students.length > 0
        ? allProgress.reduce((sum, prog) => sum + (prog?.current_level || 1), 0) / students.length
        : 0;

      setStats({
        totalStudents: students.length,
        totalActivities: totalActivitiesCount,
        totalSurveys: 0,
        avgProgress: Math.round(avgProgress * 10) / 10,
        totalPoints: totalPoints,
        activeUsers: allProgress.filter(p => p?.current_streak && p.current_streak > 0).length
      });

      setAllUsers(users);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient }: any) => (
    <div className={`bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-2xl p-6 border border-white/10`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-white/60" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-white/80 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-purple-300">Vista completa del sistema Aula Viva</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg p-1 border border-purple-500/20">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === 'overview'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              General
            </button>
            <button
              onClick={() => setSelectedView('users')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === 'users'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Usuarios
            </button>
            <button
              onClick={() => setSelectedView('data')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedView === 'data'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 inline mr-2" />
              Datos
            </button>
          </div>
        </div>

        {selectedView === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Estudiantes"
                value={stats.totalStudents}
                subtitle="Registrados en el sistema"
                gradient="from-blue-500/20 to-cyan-500/20"
              />
              <StatCard
                icon={Activity}
                title="Actividades Completadas"
                value={stats.totalActivities}
                subtitle="Por todos los estudiantes"
                gradient="from-green-500/20 to-emerald-500/20"
              />
              <StatCard
                icon={Award}
                title="Puntos Totales"
                value={stats.totalPoints.toLocaleString()}
                subtitle="Acumulados en el sistema"
                gradient="from-yellow-500/20 to-orange-500/20"
              />
              <StatCard
                icon={TrendingUp}
                title="Nivel Promedio"
                value={stats.avgProgress}
                subtitle="De todos los estudiantes"
                gradient="from-purple-500/20 to-pink-500/20"
              />
              <StatCard
                icon={Users}
                title="Usuarios Activos"
                value={stats.activeUsers}
                subtitle="Con racha activa"
                gradient="from-red-500/20 to-orange-500/20"
              />
              <StatCard
                icon={FileText}
                title="Encuestas"
                value={stats.totalSurveys}
                subtitle="Completadas"
                gradient="from-teal-500/20 to-cyan-500/20"
              />
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
                Resumen del Sistema
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Tasa de participación</span>
                  <span className="font-bold text-green-400">
                    {stats.totalStudents > 0
                      ? Math.round((stats.activeUsers / stats.totalStudents) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Promedio actividades por estudiante</span>
                  <span className="font-bold text-blue-400">
                    {stats.totalStudents > 0
                      ? Math.round((stats.totalActivities / stats.totalStudents) * 10) / 10
                      : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Promedio puntos por estudiante</span>
                  <span className="font-bold text-yellow-400">
                    {stats.totalStudents > 0
                      ? Math.round(stats.totalPoints / stats.totalStudents)
                      : 0}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedView === 'users' && (
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-purple-400" />
              Usuarios del Sistema
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-500/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Rol</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Creado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-white">{user.email || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{user.full_name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : 'Estudiante'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedView === 'data' && (
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-purple-400" />
                Gestión de Datos
              </h3>
              <p className="text-gray-300 mb-6">
                Accede a las herramientas de gestión de datos del sistema
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.hash = '#data-management'}
                  className="flex items-center space-x-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg p-4 transition-all"
                >
                  <Database className="w-8 h-8 text-blue-400" />
                  <div className="text-left">
                    <h4 className="font-bold text-white">Tabla rml_datos</h4>
                    <p className="text-sm text-gray-400">Gestionar datos de estudiantes</p>
                  </div>
                </button>
                <button
                  onClick={() => alert('Exportar datos - Próximamente')}
                  className="flex items-center space-x-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg p-4 transition-all"
                >
                  <Download className="w-8 h-8 text-green-400" />
                  <div className="text-left">
                    <h4 className="font-bold text-white">Exportar Datos</h4>
                    <p className="text-sm text-gray-400">Descargar reportes en CSV/PDF</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

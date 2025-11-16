import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Filter, Search, BarChart3, Users } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { RMLData } from '../lib/supabase';

interface SessionOneDataViewProps {
  onBack: () => void;
}

const SessionOneDataView: React.FC<SessionOneDataViewProps> = ({ onBack }) => {
  const [students, setStudents] = useState<RMLData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<RMLData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgIMC: 0,
    avgVO2Max: 0,
    avgLeger: 0,
    mejoriaPromedio: 0
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
    calculateStats();
  }, [students, searchTerm, gradeFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id_estudiante?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (gradeFilter) {
      filtered = filtered.filter(student => student.grado === gradeFilter);
    }

    setFilteredStudents(filtered);
  };

  const calculateStats = () => {
    if (students.length === 0) {
      setStats({
        totalStudents: 0,
        avgIMC: 0,
        avgVO2Max: 0,
        avgLeger: 0,
        mejoriaPromedio: 0
      });
      return;
    }

    const studentsWithData = students.filter(s =>
      (s.imc_pre && s.imc_pre > 0) ||
      (s.imc_post && s.imc_post > 0)
    );

    const totalIMC = studentsWithData.reduce((sum, s) =>
      sum + (Number(s.imc_post) || Number(s.imc_pre) || 0), 0
    );
    const totalVO2Max = studentsWithData.reduce((sum, s) =>
      sum + (Number(s.vo2max_post) || Number(s.vo2max_pre) || 0), 0
    );
    const totalLeger = studentsWithData.reduce((sum, s) =>
      sum + (Number(s.leger_post) || Number(s.leger_pre) || 0), 0
    );

    const studentsWithPre = students.filter(s => s.vo2max_pre && s.vo2max_pre > 0);
    const totalMejoria = studentsWithPre.reduce((sum, s) =>
      sum + (Number(s.vo2max_porcambio) || 0), 0
    );

    setStats({
      totalStudents: students.length,
      avgIMC: studentsWithData.length > 0 ? totalIMC / studentsWithData.length : 0,
      avgVO2Max: studentsWithData.length > 0 ? totalVO2Max / studentsWithData.length : 0,
      avgLeger: studentsWithData.length > 0 ? totalLeger / studentsWithData.length : 0,
      mejoriaPromedio: studentsWithPre.length > 0 ? totalMejoria / studentsWithPre.length : 0
    });
  };

  const uniqueGrades = [...new Set(students.map(s => s.grado).filter(Boolean))];

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { label: 'Bajo peso', color: 'text-blue-400' };
    if (imc < 25) return { label: 'Normal', color: 'text-green-400' };
    if (imc < 30) return { label: 'Sobrepeso', color: 'text-yellow-400' };
    return { label: 'Obesidad', color: 'text-red-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando datos de Sesión 1...</p>
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
              <h1 className="text-3xl font-bold">Datos Sesión 1</h1>
              <p className="text-purple-300">Mediciones Pre y Post Intervención</p>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <BarChart3 className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.totalStudents}</h3>
            <p className="text-blue-300 text-sm">Total Estudiantes</p>
          </div>

          <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⚖️</span>
              <TrendingUp className="w-5 h-5 text-green-300" />
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.avgIMC.toFixed(1)}</h3>
            <p className="text-green-300 text-sm">IMC Promedio</p>
          </div>

          <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💪</span>
              <TrendingUp className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.avgVO2Max.toFixed(1)}</h3>
            <p className="text-purple-300 text-sm">VO2Max Promedio</p>
          </div>

          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📈</span>
              {stats.mejoriaPromedio >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-white">{stats.mejoriaPromedio.toFixed(1)}%</h3>
            <p className="text-yellow-300 text-sm">Mejora Promedio</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-500/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Todos los grados</option>
                  {uniqueGrades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Datos */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-500/20">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-purple-300">Grado</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">IMC Pre</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">IMC Post</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">Categoría</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">VO2Max Pre</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">VO2Max Post</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-purple-300">Cambio %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStudents.map((student) => {
                  const imcValue = Number(student.imc_post) || Number(student.imc_pre) || 0;
                  const imcCategory = getIMCCategory(imcValue);
                  const vo2Change = Number(student.vo2max_porcambio) || 0;

                  return (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-white">{student.nombres}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{student.grado}</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-300">
                        {student.imc_pre ? Number(student.imc_pre).toFixed(1) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-300">
                        {student.imc_post ? Number(student.imc_post).toFixed(1) : '-'}
                      </td>
                      <td className={`px-4 py-3 text-sm text-center font-semibold ${imcCategory.color}`}>
                        {imcValue > 0 ? imcCategory.label : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-300">
                        {student.vo2max_pre ? Number(student.vo2max_pre).toFixed(1) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-300">
                        {student.vo2max_post ? Number(student.vo2max_post).toFixed(1) : '-'}
                      </td>
                      <td className={`px-4 py-3 text-sm text-center font-semibold ${
                        vo2Change > 0 ? 'text-green-400' : vo2Change < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {vo2Change !== 0 ? `${vo2Change > 0 ? '+' : ''}${vo2Change.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron estudiantes con los filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionOneDataView;

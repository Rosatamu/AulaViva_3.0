import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Search, Filter, Upload } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { RMLData } from '../lib/supabase';
import CSVImporter from './CSVImporter';

interface DataManagementProps {
  onBack: () => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ onBack }) => {
  const [students, setStudents] = useState<RMLData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<RMLData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<RMLData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, gradeFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getAllStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
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

  const handleSaveStudent = async (studentData: Partial<RMLData>) => {
    try {
      if (editingStudent) {
        // Debug: Verificar valores antes de la actualización
        console.log('=== DEBUG ACTUALIZACIÓN ===');
        console.log('Intentando actualizar estudiante con id_estudiante:', editingStudent.id_estudiante);
        console.log('Tipo de id_estudiante:', typeof editingStudent.id_estudiante);
        console.log('Longitud de id_estudiante:', editingStudent.id_estudiante?.length);
        console.log('Datos a actualizar:', studentData);
        console.log('Estudiante completo:', editingStudent);
        console.log('===============================');
        
        await supabaseService.updateStudent(editingStudent.id_estudiante!, studentData);
      } else {
        await supabaseService.addStudent(studentData as Omit<RMLData, 'id'>);
      }
      
      await loadStudents();
      setEditingStudent(null);
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
      try {
        await supabaseService.deleteStudent(studentId);
        await loadStudents();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar');
      }
    }
  };

  const uniqueGrades = [...new Set(students.map(s => s.grado).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Datos</h1>
              <p className="text-purple-300">Tabla rml_datos - {students.length} estudiantes</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowCSVImporter(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span className="font-semibold">Importar CSV</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Agregar Estudiante</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Filters */}
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

        {/* Students Table */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Grado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Peso</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Talla</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">IMC</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-white">{student.id_estudiante}</td>
                    <td className="px-6 py-4 text-sm text-white">{student.nombres}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{student.grado}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {student.peso_post || student.peso_pre || 'N/D'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {student.talla_post || student.talla_pre || 'N/D'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {student.imc_post || student.imc_pre || 'N/D'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id_estudiante!)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron estudiantes</p>
          </div>
        )}
      </div>

      {/* CSV Importer Modal */}
      {showCSVImporter && (
        <CSVImporter
          onClose={() => setShowCSVImporter(false)}
          onSuccess={() => {
            setShowCSVImporter(false);
            loadStudents();
          }}
        />
      )}

      {/* Edit/Add Modal */}
      {(editingStudent || showAddForm) && (
        <StudentModal
          student={editingStudent}
          onSave={handleSaveStudent}
          onClose={() => {
            setEditingStudent(null);
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

interface StudentModalProps {
  student: RMLData | null;
  onSave: (data: Partial<RMLData>) => void;
  onClose: () => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<RMLData>>({
    nombres: student?.nombres || '',
    grado: student?.grado || '',
    id_estudiante: student?.id_estudiante || '',
    sexo: student?.sexo || null,
    peso_pre: student?.peso_pre || null,
    peso_post: student?.peso_post || null,
    talla_pre: student?.talla_pre || null,
    talla_post: student?.talla_post || null,
    imc_pre: student?.imc_pre || null,
    imc_post: student?.imc_post || null,
    sexo_letra: student?.sexo_letra || '',
    edad_estimada: student?.edad_estimada || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">
              {student ? 'Editar Estudiante' : 'Agregar Estudiante'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.nombres || ''}
                  onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID Estudiante
                </label>
                <input
                  type="text"
                  value={formData.id_estudiante || ''}
                  onChange={(e) => setFormData({...formData, id_estudiante: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    student 
                      ? 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-75' 
                      : 'bg-white/10 border-white/20'
                  }`}
                  required
                  disabled={!!student}
                  placeholder={student ? 'ID no se puede modificar' : 'Ingresa el ID del estudiante'}
                />
                {student && (
                  <p className="text-xs text-gray-400 mt-1">
                    El ID del estudiante no se puede modificar durante la edición
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grado
                </label>
                <input
                  type="text"
                  value={formData.grado || ''}
                  onChange={(e) => setFormData({...formData, grado: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sexo
                </label>
                <select
                  value={formData.sexo_letra || ''}
                  onChange={(e) => setFormData({...formData, sexo_letra: e.target.value, sexo: e.target.value === 'M' ? 1 : 2})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Edad Estimada
                </label>
                <input
                  type="number"
                  value={formData.edad_estimada || ''}
                  onChange={(e) => setFormData({...formData, edad_estimada: e.target.value ? Number(e.target.value) : null})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso Pre
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.peso_pre || ''}
                  onChange={(e) => setFormData({...formData, peso_pre: e.target.value ? Number(e.target.value) : null})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso Post
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.peso_post || ''}
                  onChange={(e) => setFormData({...formData, peso_post: e.target.value ? Number(e.target.value) : null})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Talla Pre
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.talla_pre || ''}
                  onChange={(e) => setFormData({...formData, talla_pre: e.target.value ? Number(e.target.value) : null})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Talla Post
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.talla_post || ''}
                  onChange={(e) => setFormData({...formData, talla_post: e.target.value ? Number(e.target.value) : null})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
import React from 'react';
import { User, Heart, Activity, Zap, Wheat, Beef, Target } from 'lucide-react';
import { UserData } from '../types/User';

interface UserProfileProps {
  userData: UserData;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const getIMCColor = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'bajo peso':
      case 'delgadez':
        return 'text-blue-400';
      case 'normal':
      case 'peso normal':
        return 'text-green-400';
      case 'sobrepeso':
        return 'text-yellow-400';
      case 'obesidad':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getIMCIcon = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'bajo peso':
      case 'delgadez':
        return <Target className="w-6 h-6 text-blue-400" />;
      case 'normal':
      case 'peso normal':
        return <Heart className="w-6 h-6 text-green-400" />;
      case 'sobrepeso':
        return <Activity className="w-6 h-6 text-yellow-400" />;
      case 'obesidad':
        return <Activity className="w-6 h-6 text-red-400" />;
      default:
        return <Heart className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {userData.nombres || userData.name}
          </h2>
          <p className="text-purple-300">ID: {userData.id}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{userData.age} años</span>
            {userData.grado && <span>Grado: {userData.grado}</span>}
            {userData.sexo && <span>Sexo: {userData.sexo}</span>}
          </div>
        </div>
      </div>

      {/* Métricas Antropométricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">kg</span>
            </div>
            <span className="text-sm text-gray-400">Peso</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{userData.weight || 'N/D'}</p>
        </div>

        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">cm</span>
            </div>
            <span className="text-sm text-gray-400">Talla</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{userData.height || 'N/D'}</p>
        </div>

        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-2">
            {getIMCIcon(userData.classification)}
            <span className="text-sm text-gray-400">IMC</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{userData.imc || 'N/D'}</p>
          <p className={`text-sm font-semibold ${getIMCColor(userData.classification)}`}>
            {userData.classification}
          </p>
        </div>
      </div>

      {/* Métricas Nutricionales */}
      {(userData.energia || userData.carbohidratos || userData.proteinas) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Perfil Nutricional</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userData.energia && (
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm text-gray-400">Energía</span>
                </div>
                <p className="text-xl font-bold text-yellow-400">{userData.energia}</p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
            )}

            {userData.carbohidratos && (
              <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Wheat className="w-6 h-6 text-orange-400" />
                  <span className="text-sm text-gray-400">Carbohidratos</span>
                </div>
                <p className="text-xl font-bold text-orange-400">{userData.carbohidratos}</p>
                <p className="text-xs text-gray-500">g</p>
              </div>
            )}

            {userData.proteinas && (
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Beef className="w-6 h-6 text-red-400" />
                  <span className="text-sm text-gray-400">Proteínas</span>
                </div>
                <p className="text-xl font-bold text-red-400">{userData.proteinas}</p>
                <p className="text-xs text-gray-500">g</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actividad Física */}
      {(userData.actividad_fisica || userData.vo2max_pre || userData.vo2max_post) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Evaluación Física</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.actividad_fisica && (
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  <span className="text-sm text-gray-400">Nivel de Actividad</span>
                </div>
                <p className="text-xl font-bold text-cyan-400">{userData.actividad_fisica}</p>
                <p className="text-xs text-gray-500">Escala 1-5</p>
              </div>
            )}
            
            {(userData.vo2max_pre || userData.vo2max_post) && (
              <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-6 h-6 text-red-400" />
                  <span className="text-sm text-gray-400">VO2 Max</span>
                </div>
                <div className="flex items-center space-x-2">
                  {userData.vo2max_pre && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-400">{userData.vo2max_pre}</p>
                      <p className="text-xs text-gray-500">Pre</p>
                    </div>
                  )}
                  {userData.vo2max_pre && userData.vo2max_post && (
                    <span className="text-gray-400">→</span>
                  )}
                  {userData.vo2max_post && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-400">{userData.vo2max_post}</p>
                      <p className="text-xs text-gray-500">Post</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {(userData.fuerza_pre || userData.fuerza_post) && (
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-gray-400">Fuerza</span>
                </div>
                <div className="flex items-center space-x-2">
                  {userData.fuerza_pre && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-400">{userData.fuerza_pre}</p>
                      <p className="text-xs text-gray-500">Pre</p>
                    </div>
                  )}
                  {userData.fuerza_pre && userData.fuerza_post && (
                    <span className="text-gray-400">→</span>
                  )}
                  {userData.fuerza_post && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-400">{userData.fuerza_post}</p>
                      <p className="text-xs text-gray-500">Post</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {(userData.leger_pre || userData.leger_post || userData.flex_pre || userData.flex_post) && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Evaluaciones Adicionales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(userData.leger_pre || userData.leger_post) && (
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Test de Leger</span>
                </div>
                <div className="flex items-center space-x-2">
                  {userData.leger_pre && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-400">{userData.leger_pre}</p>
                      <p className="text-xs text-gray-500">Pre</p>
                    </div>
                  )}
                  {userData.leger_pre && userData.leger_post && (
                    <span className="text-gray-400">→</span>
                  )}
                  {userData.leger_post && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-400">{userData.leger_post}</p>
                      <p className="text-xs text-gray-500">Post</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {(userData.flex_pre || userData.flex_post) && (
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-400">Flexibilidad</span>
                </div>
                <div className="flex items-center space-x-2">
                  {userData.flex_pre && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-400">{userData.flex_pre}</p>
                      <p className="text-xs text-gray-500">Pre</p>
                    </div>
                  )}
                  {userData.flex_pre && userData.flex_post && (
                    <span className="text-gray-400">→</span>
                  )}
                  {userData.flex_post && (
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-400">{userData.flex_post}</p>
                      <p className="text-xs text-gray-500">Post</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Datos desde API */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div> 
            <p className="text-sm text-gray-400">Datos desde Supabase</p>
            <p className="text-xs text-purple-300 font-mono">Base de Datos: PostgreSQL</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Supabase Conectado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
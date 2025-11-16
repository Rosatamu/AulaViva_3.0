import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, Award, Heart, Sparkles, BarChart3 } from 'lucide-react';
import { MarketService } from '../services/marketService';

interface ImpactStats {
  totalProjects: number;
  totalSales: number;
  totalRevenue: number;
  beneficiaries: number;
  institutions: number;
  socialImpactScore: number;
}

const ImpactDashboard: React.FC = () => {
  const [stats, setStats] = useState<ImpactStats>({
    totalProjects: 0,
    totalSales: 0,
    totalRevenue: 0,
    beneficiaries: 0,
    institutions: 54,
    socialImpactScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const listings = await MarketService.getAllListings();

      const totalProjects = listings.length;
      const totalSales = listings.reduce((sum, l) => sum + l.ventas, 0);
      const totalRevenue = listings.reduce((sum, l) => sum + (l.ventas * l.precio), 0);
      const uniqueInstitutions = new Set(listings.map(l => l.institucion)).size;

      const beneficiaries = totalSales * 3.5;
      const socialImpactScore = Math.min(100, Math.round((totalProjects * 10 + totalSales * 5 + beneficiaries * 0.5) / 10));

      setStats({
        totalProjects,
        totalSales,
        totalRevenue,
        beneficiaries: Math.round(beneficiaries),
        institutions: uniqueInstitutions,
        socialImpactScore
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    trend?: string;
  }> = ({ icon, title, value, subtitle, color, trend }) => (
    <div className={`bg-gradient-to-br ${color} backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/30 transition-all transform hover:scale-105`}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/10 rounded-lg">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-green-400 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
      <p className="text-xs text-white/60">{subtitle}</p>
    </div>
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Impact Section */}
      <div className="relative bg-gradient-to-br from-green-900/60 via-yellow-900/60 to-green-900/60 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mr-3 animate-pulse" />
            <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">
              Impacto EmprendeQuindío
            </h2>
          </div>
          <p className="text-center text-xl text-gray-300 mb-8">
            Transformando el Quindío a través del emprendimiento escolar
          </p>

          {/* Main Impact Score */}
          <div className="max-w-md mx-auto bg-black/40 rounded-2xl p-8 border border-yellow-500/30">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400 mb-2">Puntuación de Impacto Social</p>
              <div className="relative inline-block">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.socialImpactScore / 100)}`}
                    className="text-yellow-400 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-400">{stats.socialImpactScore}</p>
                    <p className="text-xs text-gray-400">de 100</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-300">
              Basado en proyectos activos, ventas y beneficiarios
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<ShoppingBag className="w-6 h-6 text-blue-400" />}
          title="Proyectos Activos"
          value={stats.totalProjects}
          subtitle="Emprendimientos escolares registrados"
          color="from-blue-900/40 to-blue-800/40"
          trend="+12%"
        />

        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-400" />}
          title="Ventas Realizadas"
          value={stats.totalSales}
          subtitle="Transacciones completadas exitosamente"
          color="from-green-900/40 to-green-800/40"
          trend="+28%"
        />

        <StatCard
          icon={<DollarSign className="w-6 h-6 text-yellow-400" />}
          title="Ingresos Generados"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Capital movilizado en el ecosistema"
          color="from-yellow-900/40 to-yellow-800/40"
          trend="+35%"
        />

        <StatCard
          icon={<Users className="w-6 h-6 text-purple-400" />}
          title="Beneficiarios Directos"
          value={stats.beneficiaries}
          subtitle="Personas impactadas positivamente"
          color="from-purple-900/40 to-purple-800/40"
        />

        <StatCard
          icon={<Award className="w-6 h-6 text-orange-400" />}
          title="Instituciones Participantes"
          value={stats.institutions}
          subtitle="De las 54 instituciones del Quindío"
          color="from-orange-900/40 to-orange-800/40"
        />

        <StatCard
          icon={<Heart className="w-6 h-6 text-pink-400" />}
          title="Impacto Ambiental"
          value="327 kg"
          subtitle="CO₂ reducido con proyectos ecológicos"
          color="from-pink-900/40 to-pink-800/40"
        />
      </div>

      {/* Impact Categories */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-6 h-6 text-green-400 mr-3" />
          <h3 className="text-2xl font-bold">Distribución por Categoría</h3>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Sostenibilidad Ambiental', percentage: 35, color: 'bg-green-500' },
            { name: 'Innovación Tecnológica', percentage: 28, color: 'bg-blue-500' },
            { name: 'Emprendimiento Social', percentage: 22, color: 'bg-purple-500' },
            { name: 'Cultura y Tradición', percentage: 10, color: 'bg-yellow-500' },
            { name: 'Salud y Bienestar', percentage: 5, color: 'bg-pink-500' }
          ].map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{category.name}</span>
                <span className="text-gray-400 font-semibold">{category.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`${category.color} h-full rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasa de Éxito', value: '94%', icon: '🎯' },
          { label: 'Satisfacción', value: '4.8/5', icon: '⭐' },
          { label: 'Retención', value: '87%', icon: '🔄' },
          { label: 'Crecimiento', value: '+156%', icon: '📈' }
        ].map((metric, index) => (
          <div key={index} className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/10 text-center">
            <div className="text-3xl mb-2">{metric.icon}</div>
            <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
            <p className="text-xs text-gray-400">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-900/40 to-yellow-900/40 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/30 text-center">
        <Heart className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold mb-2">¡Únete al Movimiento!</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Cada proyecto registrado fortalece el ecosistema emprendedor del Quindío.
          Tu idea puede transformar vidas y comunidades.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-black/30 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-400">Meta 2025</p>
            <p className="text-2xl font-bold text-yellow-400">1,000 proyectos</p>
          </div>
          <div className="bg-black/30 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-400">Meta 2025</p>
            <p className="text-2xl font-bold text-green-400">$100M COP</p>
          </div>
          <div className="bg-black/30 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-400">Meta 2025</p>
            <p className="text-2xl font-bold text-purple-400">10K beneficiarios</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;

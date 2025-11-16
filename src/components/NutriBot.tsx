import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, X, Send, Heart, Star, Lightbulb } from 'lucide-react';

interface NutriBotProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  currentContext?: string;
}

const NutriBot: React.FC<NutriBotProps> = ({ isOpen, onClose, userData, currentContext }) => {
  const [messages, setMessages] = useState<Array<{id: number, text: string, isBot: boolean, timestamp: Date}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensaje de bienvenida personalizado
      const welcomeMessage = {
        id: 1,
        text: `¡Hola ${userData.name}! 🌟 Soy NutriBot, tu mentor personal en Aula Viva. Estoy aquí para ayudarte en tu aventura de salud y bienestar. ¿En qué puedo apoyarte hoy?`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userData.name, messages.length]);

  const botResponses = {
    actividad: [
      "¡Excelente que quieras moverte! 💪 La actividad física es como un superpoder para tu cuerpo. ¿Qué tipo de ejercicio te gusta más?",
      "¡Qué buena decisión! Cada paso cuenta. ¿Cómo te sientes después de hacer ejercicio?",
      "¡Increíble! Tu corazón se fortalece cada vez que te mueves. ¿Has notado algún cambio en tu energía?"
    ],
    nutricion: [
      "¡Me encanta que pienses en tu alimentación! 🍎 Comer bien es como darle combustible premium a tu cuerpo. ¿Qué comida saludable te gusta más?",
      "¡Qué inteligente! Los alimentos son como pequeños superhéroes que te dan energía. ¿Has probado algo nuevo últimamente?",
      "¡Fantástico! Tu cuerpo te agradece cada buena decisión alimentaria. ¿Cómo te sientes cuando comes saludable?"
    ],
    motivacion: [
      "¡Eres increíble! 🌟 Cada pequeño paso que das es un gran logro. ¿Qué te motiva más a seguir adelante?",
      "¡Estoy muy orgulloso de ti! Tu dedicación es inspiradora. ¿Cuál ha sido tu mayor logro hasta ahora?",
      "¡Sigue así! Recuerda que los hábitos saludables son regalos que te das a ti mismo. ¿Qué hábito te gustaría desarrollar?"
    ],
    general: [
      "¡Qué interesante! Me encanta conversar contigo. ¿Hay algo específico sobre salud que te gustaría aprender?",
      "¡Excelente pregunta! Siempre es bueno ser curioso sobre tu bienestar. ¿Te gustaría que te cuente algo divertido sobre nutrición o ejercicio?",
      "¡Me alegra que estés aquí! Tu interés por aprender es admirable. ¿En qué área te gustaría mejorar más?"
    ]
  };

  const getContextualResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('ejercicio') || lowerMessage.includes('actividad') || lowerMessage.includes('deporte')) {
      return botResponses.actividad[Math.floor(Math.random() * botResponses.actividad.length)];
    }
    if (lowerMessage.includes('comida') || lowerMessage.includes('nutrición') || lowerMessage.includes('alimento')) {
      return botResponses.nutricion[Math.floor(Math.random() * botResponses.nutricion.length)];
    }
    if (lowerMessage.includes('motivación') || lowerMessage.includes('ánimo') || lowerMessage.includes('ayuda')) {
      return botResponses.motivacion[Math.floor(Math.random() * botResponses.motivacion.length)];
    }
    
    return botResponses.general[Math.floor(Math.random() * botResponses.general.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getContextualResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { text: "¿Cómo puedo mejorar mi alimentación?", icon: "🍎" },
    { text: "¿Qué ejercicios me recomiendas?", icon: "💪" },
    { text: "¿Cómo puedo mantenerme motivado?", icon: "⭐" },
    { text: "Cuéntame sobre mi progreso", icon: "📈" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md h-[600px] flex flex-col border border-purple-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">NutriBot</h3>
              <p className="text-xs text-green-400">Tu mentor personal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.isBot
                  ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/20'
                  : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20'
              }`}>
                {message.isBot && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400 font-semibold">NutriBot</span>
                  </div>
                )}
                <p className="text-sm text-white">{message.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {message.timestamp.toLocaleTimeString('es-CO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/20 p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-green-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-3">Preguntas rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(action.text)}
                  className="text-left p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-xs text-gray-300">{action.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutriBot;
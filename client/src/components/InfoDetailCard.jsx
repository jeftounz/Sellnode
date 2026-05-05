import { X } from 'lucide-react';

const InfoDetailCard = ({ isOpen, onClose, title, icon: Icon, data, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header de la Carta */}
        <div className="relative h-32 bg-indigo-600 flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="h-20 w-20 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl">
            <Icon size={40} />
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">{title}</h2>
            <p className="text-slate-400 text-sm font-medium tracking-wide">DETALLES REGISTRADOS</p>
          </div>

          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{key}</span>
                <span className="text-sm font-semibold text-slate-700">{value}</span>
              </div>
            ))}
          </div>

          {/* Acciones (Opcional) */}
          {actions && (
            <div className="mt-8 flex gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoDetailCard;
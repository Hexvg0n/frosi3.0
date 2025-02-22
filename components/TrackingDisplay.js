// components/TrackingDisplay.js
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, MapPin, Package, Calendar } from 'lucide-react';

const statusIcons = {
  "Odebrane": <CheckCircle className="w-6 h-6 text-green-400" />,
  "W drodze": <Clock className="w-6 h-6 text-yellow-400" />,
  "Anulowano": <XCircle className="w-6 h-6 text-red-400" />,
  "Dostarczono": <Package className="w-6 h-6 text-blue-400" />,
  "W magazynie": <MapPin className="w-6 h-6 text-purple-400" />
};

const GlassCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/30 mb-6"
  >
    {children}
  </motion.div>
);

const TrackingDisplay = ({ data }) => {
  return (
    <div className="space-y-6">
      <GlassCard>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
          <Package className="inline-block mr-3" />
          Informacje główne
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data["Informacje główne"]).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-gray-400">
                  {key === 'Data' && <Calendar className="w-5 h-5" />}
                  {key === 'Numer śledzenia' && <Package className="w-5 h-5" />}
                  {key === 'Kraj' && <MapPin className="w-5 h-5" />}
                  <span className="font-medium">{key}</span>
                </div>
                <span className="text-gray-200 font-mono">{value || "N/A"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
          <MapPin className="inline-block mr-3" />
          Historia przesyłki
        </h2>

        <div className="space-y-4">
          {data["Szczegóły przesyłki"].map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 bg-gray-900/40 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-1">
                  {statusIcons[detail.Status] || <Clock className="w-6 h-6 text-gray-500" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                      {detail.Status}
                    </span>
                    <span className="text-sm text-gray-500">{detail.Data}</span>
                  </div>
                  
                  {detail.Lokalizacja && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{detail.Lokalizacja}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default TrackingDisplay;
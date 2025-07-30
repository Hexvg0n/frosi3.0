import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/router';

export default function BestSellersSection() {
  const router = useRouter();
  const bestsellers = [
    { id: 1, title: "Air Jordan 4", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6656410659&affcode=frosireps", image: "/images/101.png" },
    { id: 2, title: "Air Force 1", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D5303810327&affcode=frosireps", image: "/images/102.png" },
    { id: 3, title: "Yeezy Slide", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6357399660&affcode=frosireps", image: "/images/103.png" },
    { id: 4, title: "YZY X GAP X BALENCIAGA", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D683748985499&affcode=frosireps", image: "/images/104.png" },
    { id: 5, title: "Air Jordan 1 Retro High Travis Scott OG Mocha", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6388553113&affcode=frosireps", image: "/images/105.png" },
    { id: 6, title: "Air Pods 2", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6516369527&affcode=frosireps", image: "/images/106.png" },
    { id: 7, title: "Rick Owens Ramones", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D741087802238&affcode=frosireps", image: "/images/107.png" },
    { id: 8, title: "TNF Jacket", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6503405541&affcode=frosireps", image: "/images/108.png" },
  ];
  const handleQCClick = (link) => {
    router.push(`/qc?url=${encodeURIComponent(link)}`);
  };

  return (
    <div className="relative py-24 px-4">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div 
          className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Best Sellers
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-xl border border-white/10 rounded-3xl p-4 hover:border-white/20 transition-all shadow-2xl shadow-black/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-contain mb-4"
              />
              
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => handleQCClick(item.linkTo)}
                    className="flex items-center justify-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-5 h-5" />
                    QC
                  </motion.button>
                  
                  <motion.a
                    href={item.linkTo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Kup
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function BestSellersSection() {
  const bestsellers = [
    { id: 1, title: "Air Jordan 4", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6656410659&affcode=frosireps", image: "/images/101.png" },
    { id: 2, title: "Air Force 1", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D5303810327&affcode=frosireps", image: "/images/102.png" },
    { id: 3, title: "Yeezy Slide", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6357399660&affcode=frosireps", image: "/images/103.png" },
    { id: 4, title: "YZY X GAP X BALENCIAGA", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D683748985499&affcode=frosireps", image: "/images/104.png" },
    { id: 5, title: "Air Jordan 1 Retro High Travis Scott OG Mocha", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6388553113&affcode=frosireps", image: "/images/105.png" },
    { id: 6, title: "Air Pods 2", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6516369527&affcode=frosireps", image: "/images/106.png" },
    { id: 7, title: "Rick Owens Rammones", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D741087802238&affcode=frosireps", image: "/images/107.png" },
    { id: 8, title: "TNF Jacket", linkTo: "https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6503405541&affcode=frosireps", image: "/images/108.png" },
  ];


  const router = useRouter();

  const handleQCClick = (link) => {
    router.push(`/qc?url=${encodeURIComponent(link)}`);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div
      className="p-8 mt-0 min-h-auto border-t-2 border-gray-700 mb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-200">
        Best Sellers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto ">
        {bestsellers.map((item) => (
          <motion.div
            key={item.id}
            className="flex flex-col  rounded-lg  shadow-md shadow-white overflow-hidden border-2 "
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: '0px 10px 15px rgba(255, 255, 255, 0.5)',
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-[90%]  object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                {item.title}
              </h3>
              <div className="mt-auto flex flex-col space-y-2">
                <motion.button
                  onClick={() => handleQCClick(item.linkTo)}
                  className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-300 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300"
                >
                  <Search className="mr-2" size={20} />
                  QC
                </motion.button>
                <motion.a
                  href={item.linkTo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300"
                >
                  <ShoppingCart className="mr-2" size={20} />
                  Kup na KakoBuy
                </motion.a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';


export default function BestSellersSection() {
    const bestsellers = [
        { id: 1, title: "Air Jordan 4",linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6656410659%26spider_token%3D5f60?partnercode=wf5ZpA", image: "/images/101.png" },
        { id: 2, title: "Air Force 1",linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fweidian.com%2Ffastorder.html%3FitemID%3D5303810327?partnercode=wf5ZpA", image: "/images/102.png" },
        { id: 3, title: "Yeezy Slide",linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6357399660%26spider_token%3D2f72?partnercode=wf5ZpA", image: "/images/103.png" },
        { id: 4, title: "YZY X GAP X BALENCIAGA",linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D683748985499?partnercode=wf5ZpA", image: "/images/104.png" },
        { id: 5, title: "Air Jordan 1 Retro High Travis Scott OG Mocha",linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6388553113%26spider_token%3D0452?partnercode=wf5ZpA", image: "/images/105.png" },
        { id: 6, title: "Air Pods 2",linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6516369527%26spider_token%3Dd6de?partnercode=wf5ZpA", image: "/images/106.png" },
        { id: 7, title: "Rick Owens Rammones",linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D741087802238?partnercode=wf5ZpA", image: "/images/107.png" },
        { id: 8, title: "TNF Jacket", linkTo: "https://www.allchinabuy.com/en/page/buy/?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D6503405541%26spider_token%3D5559?partnercode=wf5ZpA", image: "/images/108.png" },
    ];
    const router = useRouter(); // Inicjalizacja routera

    const handleQCClick = (link) => {
      router.push(`/qc?url=${encodeURIComponent(link)}`);
    };

    return (
        <div className="p-8 mt-[3vh] min-h-[80vh] border-t-2 border-gray-500">
            <h2 className="text-4xl font-bold text-center mb-[12vh] text-gray-300">Best Sellery</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
  {bestsellers.map((item) => (
    <div
      key={item.id}
      className="flex flex-col bg-transparent rounded-lg shadow-lg p-4 border border-gray-300 h-full"
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full object-cover rounded-lg mb-4 flex-shrink-0"
      />
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">{item.title}</h3>
        <div className="mt-auto flex flex-col space-y-2">
          <button  onClick={() => handleQCClick(item.linkTo)} className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all font-bold">
            QC
          </button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-bold">
            <a href={item.linkTo}>Kup na AllChinaBuy</a>
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
    );
}
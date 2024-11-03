import { FaDiscord } from "react-icons/fa";

export default function FooterTwoSection() {
  return (
    <footer className="bg-transparent text-white py-12 px-6 ">
      <div className="max-w-[85vw] mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 md:w-1/4 flex justify-center md:justify-start">
          <img src="/images/logo.png" alt="Logo" className="h-[20vh] object-contain" />
        </div>

        <div className="md:w-2/4 text-center md:text-left mb-6 md:mb-0 text-sm leading-relaxed">
          <p>
            Frosireps.eu nie jest powiązane z Weidian.com, Taobao.com, 1688.com, tmall.com ani żadną inną platformą zakupową („platformy”).
            Ta strona nie jest oficjalną ofertą tych platform.
          </p>
          <p className="mt-4">
            Wszystkie linki do hagobuy.com są linkami afiliacyjnymi. Obejmuje to przyciski z cenami, linki oznaczone gwiazdką oraz linki osadzone w obrazach.
            Nie otrzymujemy prowizji ze sprzedaży przedmiotów, a jedynie za ich funkcję jako spedytor.
          </p>
          <p className="mt-4">
            Nie jesteśmy sklepem internetowym i nie sprzedajemy żadnych produktów, a także nie jesteśmy w żaden sposób powiązani ze stroną internetową Hagobuy ani marką.
            Nasza strona internetowa została zaprojektowana wyłącznie w celu pomocy w znajdowaniu produktów dostępnych na Hagobuy.
          </p>
          <p className="mt-4">
            Prosimy o świadomość, że ta strona zawiera linki afiliacyjne.
            Oznacza to, że jeśli dokonasz zakupu za pośrednictwem tych linków, możemy otrzymać niewielką prowizję.
            Ta prowizja pomaga nam utrzymywać i rozwijać naszą stronę internetową bez dodatkowych kosztów dla Ciebie. Doceniamy Twoje wsparcie!
          </p>
        </div>

        <div className="md:w-1/4 text-center md:text-right">
          <div className="flex flex-col justify-center  md:items-center">
            <p className="text-lg leading-relaxed">
              Jeśli potrzebujesz pomocy, dołącz na nasz serwer
            </p>
            <div className="flex justify-center md:w-1/4">
            <FaDiscord className="text-5xl mb-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
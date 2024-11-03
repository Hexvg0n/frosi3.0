import { GrFormView } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { RiTiktokLine } from "react-icons/ri";

export default function AboutSection() {
  return (
    <section className="bg-transparent py-12 px-4 border-t-2 border-gray-500">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-6 md:mb-0 relative group">
          <img
            src="/images/about.png"
            alt="Frosi aka Rudy"
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 scale-105">
            <p className="text-white text-xl flex flex-col items-center"> < FaDiscord className="text-5xl mt-4"/>  <br/>+24 400 osób na discordzie <br/><RiTiktokLine className="text-5xl mt-4"/> <br/>+61k like'ów na tiktoku <br/><GrFormView className="text-5xl mt-4"/><br/> +1M wyświetleń</p>
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8 text-center md:text-left text-white">
          <h1 className="text-4xl font-bold mb-6">Frosi aka Rudy</h1>
          <p className="text-lg ">
            Jestem pionierem wśród polskich twórców treści agencyjnych, będąc jednym z pierwszych, którzy odkryli i zaprezentowali ofertę HagoBuy zamiast bardziej konwencjonalnego Pandabuy. 
            Mój kreatywny duch i innowacyjne podejście sprawiły, że zyskałem wielu zwolenników, z milionami wyświetleń urzeczonych moim odrębnym stylem i ekskluzywnością replik, które odkrywam. 
            W ciągu ostatniego roku intensywnie badałem świat replik, eksperymentując z różnymi agentami i sprzedawcami, gromadząc dużą kolekcję obejmującą wiele kategorii.
          </p>
        </div>
      </div>
    </section>
  );
}
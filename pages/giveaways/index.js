import { useState } from 'react';
import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import Form from '@/components/Form';

export default function Giveaway() {
  const [language, setLanguage] = useState('pl');

  const generateSnowflakes = () => {
    const snowflakes = [];
    const numOfSnowflakes = 200; // zwiększona liczba płatków śniegu

    for (let i = 0; i < numOfSnowflakes; i++) {
      const size = Math.random() * 5 + 2; // losowy rozmiar płatka
      const left = Math.random() * 100; // losowa pozycja pozioma
      const delay = Math.random() * 5 + 's'; // losowe opóźnienie
      const duration = Math.random() * 5 + 5 + 's'; // losowy czas trwania animacji

      snowflakes.push(
        <div
          key={i}
          className="snowflake"
          style={{
            width: size + 'px',
            height: size + 'px',
            left: `${left}%`,
            animationDelay: delay,
            animationDuration: duration,
          }}
        />
      );
    }

    return snowflakes;
  };

  return (
    <>
      <NavbarSection />
      
      {/* Zasady konkursu */}
      <div className="rules-container bg-gray-800 text-white p-8 rounded-lg shadow-lg mb-8 mx-auto w-full max-w-4xl relative">
        {/* Suwak do zmiany języka */}
        <div className="language-switcher absolute top-4 right-4 flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            {/* Przełącznik dla języka polskiego */}
            <input
              type="radio"
              id="language-pl"
              name="language"
              value="pl"
              checked={language === 'pl'}
              onChange={() => setLanguage('pl')}
              className="hidden"
            />
            <label
              htmlFor="language-pl"
              className={`cursor-pointer p-2 rounded-full ${language === 'pl' ? 'bg-blue-600' : 'bg-gray-400'} transition-colors duration-300`}
            >
              🇵🇱
            </label>

            {/* Przełącznik dla języka angielskiego */}
            <input
              type="radio"
              id="language-en"
              name="language"
              value="en"
              checked={language === 'en'}
              onChange={() => setLanguage('en')}
              className="hidden"
            />
            <label
              htmlFor="language-en"
              className={`cursor-pointer p-2 rounded-full ${language === 'en' ? 'bg-blue-600' : 'bg-gray-400'} transition-colors duration-300`}
            >
              🇬🇧
            </label>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-left mb-4">{language === 'pl' ? 'Zasady udziału w konkursie "List do Świętego Mikołaja"' : 'Rules for Participating in the “Letter to Santa” Contest'} 🎄</h2>
        
        <ol className="list-decimal pl-5 space-y-4">
          <li><b>{language === 'pl' ? 'Aby wziąć udział w konkursie, należy:' : 'To participate in the contest, you need to:'} ✨ </b>
            <ul className="list-inside list-disc pl-5">
              <li>{language === 'pl' ? 'Załóż konto na' : 'Create an account on'} <a href="https://www.kakobuy.com/register/?affcode=frosireps" className="text-blue-500 hover:text-blue-700">Kakobuy</a> - {language === 'pl' ? 'Link i wyślij zrzut ekranu potwierdzający założenie konta' : 'Link and send a screenshot confirming the account creation'} 📸.</li>
              <li>{language === 'pl' ? 'Dołącz do naszego serwera' : 'Join our'} <a href='https://discord.gg/frosireps' className="text-blue-500 hover:text-blue-700">Discord</a>  {language === 'pl'? 'i wyślij zrzut ekranu' : '  server and submit the screenshot via a private message to'} @nonamepoland 💌.</li>
            </ul>
          </li>

          <li><b>{language === 'pl' ? 'Napisz list do Świętego Mikołaja 🎅🏼' : 'Write a letter to Santa 🎅🏼'}</b>
            <ul className="list-inside list-disc pl-5">
              <li>{language === 'pl' ? 'Napisz swój list do Mikołaja na naszej stronie' : 'Write your letter to Santa on our website'} 📝.</li>
              <li>{language === 'pl' ? '(Możesz wybrać prezent o wartości do 500 PLN 🎁).' : '(You can choose a gift worth up to 125$ 🎁).'}</li>
            </ul>
          </li>

          <li><b>{language === 'pl' ? 'Informacje o konkursie ℹ️' : 'Contest Information ℹ️'}</b>
            <ul className="list-inside list-disc pl-5">
              <li><b>{language === 'pl' ? 'Jak wybieramy zwycięzców? 🎉' : 'How do we select the winners? 🎉'}</b>
                <ul className="list-inside list-disc pl-5">
                <li>
  {language === 'pl' 
    ? 'Trzech zwycięzców zostanie wybranych losowo na kanale ' 
    : 'Three winners will be randomly drawn on the channel '}
  <a href="https://discord.gg/wb2rWRNQ" className="text-blue-500 hover:text-blue-700">#🎄・konkursy</a> 🎲.
</li>
                  <li>{language === 'pl' ? 'Dodatkowo dwóch zwycięzców zostanie wybranych na podstawie kreatywności ich listów 🏆.' : 'Two additional winners will be selected based on the creativity of their letters 🏆.'}</li>
                </ul>
              </li>
            </ul>
          </li>
        </ol>

        <b>{language === 'pl' ? 'W tym roku Święty Mikołaj jest wyjątkowo hojny – pokrywa również koszty wysyłki! 🚚' : 'This year, Santa is exceptionally generous – he’s also covering shipping costs! 🚚'}</b>
        <p>{language === 'pl' ? 'Prezenty nie muszą być tylko replikami, wybór należy do Ciebie! 🎁' : 'Gifts don’t have to be just replicas, the choice is yours. Pick what suits you best! 🎁'}</p>
      </div>

      <Form />
      <FooterSection />
      <FooterTwoSection />
      
      {/* Płatki śniegu */}
      <div className="snow-container">
        {generateSnowflakes()}
      </div>
    </>
  );
}

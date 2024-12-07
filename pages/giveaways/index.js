import NavbarSection from "@/components/NavbarSection";
import FooterSection from "@/components/FooterSection";
import FooterTwoSection from "@/components/FooterTwoSection";
import Form from '@/components/Form';

export default function Giveaway() {
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
      <Form />
      <FooterSection />
      <FooterTwoSection />
      <div className="snow-container">
        {generateSnowflakes()}
      </div>
    </>
  );
}

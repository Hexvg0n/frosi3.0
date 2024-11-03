import "../public/css/globals.css"; 

function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background-image: url(/images/background.png);
        }
        ::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default App;

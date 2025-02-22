import "../public/css/globals.css"; 
import Head from "next/head"; // Import Head from next/head
import { Inter } from "next/font/google";
function App({ Component, pageProps }) {
  return (
    <>
	 <Head>
        <title>FrosiReps</title>
        <meta name="description" content="taobao agent,1688 agent ,weidian agent,taobao agent in china,taobao shopping service,shopping in china,shopping service in china,shopping agent in china, vectoreps, frosireps, reps, spreasheet, fashionreps, fashionrepspolsa, fashionrepspolska, repmafia, pandabuy, kakobuy, hagobuy" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="keywords" content="taobao agent,1688 agent ,weidian agent,taobao agent in china,taobao shopping service,shopping in china,shopping service in china,shopping agent in china, vectoreps, frosireps, reps, spreasheet, fashionreps, fashionrepspolsa, fashionrepspolska, repmafia, pandabuy, kakobuy, hagobuy, hegobuy, cnfans, orientdig, allchinabuy, cssbuy , repworld, superbuy, best batch, batch , best"/>
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
       
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

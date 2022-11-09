import "../styles/globals.css";
import "../styles/bootstrap.css";
// import 'bootstrap/dist/css/bootstrap.css';
import "../styles/style.css";
import "../styles/modal.css";
import "../styles/dark.css";
import "../styles/animate.css";
import "../styles/magnific-popup.css";
import "../styles/custom.css";
import Header from "../utils/components/Header";
import Footer from "../utils/components/Footer";


function MyApp({ Component, pageProps }) {

  return (
    <>
      <Header />
      <Component {...pageProps}/>
      <Footer />
    </>
  );
}

export default MyApp;

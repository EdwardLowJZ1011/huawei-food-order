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
import Modal from "../utils/components/Modal";
import { getMenuImageURL } from "../utils/common/getMenuImage";


function MyApp({ Component, pageProps }) {
  var menuImage = getMenuImageURL();
  return (
    <>
      <Modal menuImage={menuImage}/>
      <Header />
      <Component {...pageProps} menuImage={menuImage}/>
      <Footer />
    </>
  );
}

export default MyApp;

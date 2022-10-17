const ModalHandler = (elem) => {
    const elm = document.getElementById(elem).style.display;
    elm = elm == "block" ? "none" : "block";
    document.getElementById(elem).style.display = elm;
  };    


export default ModalHandler
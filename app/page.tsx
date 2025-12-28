import Hero from "./index_components/hero/hero";
import Product from "./index_components/product/product";
import './index.css';
import Form from "./index_components/form/form";

export default function Home() {

  const data = {
    product: {
      ggGloves: {
        title: "GG-Gloves",
        subtitle: "Mejora tu experiencia trabajando en tu computadora o jugando videojuegos",
        imgSrc: "/GG-Gloves-model-1.png",
        imgAlt: "Mano derecha usando los GG-Gloves apuntando a la izquierda",
        benefitsSlides: {
          iconsSrc: ["/secure-icon.svg", "/hands-dry-icon.png", "/ice-icon.svg", "/movement-icon.png"],
          iconsAlt: ["Ícono de seguridad", "Ícono de manos secas", "Ícono de frescura", "Ícono de movilidad del mouse"],
          description: [
            "Proteje tu muñeca, la zona tenar e hipotenar con una almohadilla de alta calidad", 
            "La tela absorbente de humedad ayuda a mantener tus manos secas",
            "Tela delgada y transpirable que discipa el calor de tus manos manteniéndolas frescas",
            "Reduce la fricción del movimiento del mouse y mejora tu precisión"
          ],
        }
      }
    }
  }
  return (
    <div id="landing-page-container">
      <Hero></Hero>
      <Product
        title={data.product.ggGloves.title}
        subtitle={data.product.ggGloves.subtitle}
        imgSrc={data.product.ggGloves.imgSrc}
        imgAlt={data.product.ggGloves.imgAlt}
        benefits={data.product.ggGloves.benefitsSlides}
        ></Product>
        <h3 id="form-cta-title">¿Cómo te gustaria seguir conectado con nosotros?</h3>
        <Form></Form>
    </div>
  );
}

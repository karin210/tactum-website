import Image from "next/image";
import "./hero.css";

export default function Hero() {
  return (
    <main id="hero-container">
      <h1>
        Trabaja cómodo, <br />
        juega mejor
      </h1>
      <Image
        src="/gg-gloves-v-0.2.png"
        alt="Imagen frontal de los GG-Gloves"
        id="hero-img"
        width={940}
        height={540}
        loading="eager"
      />
      <h2>Guantes que no paran en la ergonomía, también traen experiencia</h2>
    </main>
  );
}

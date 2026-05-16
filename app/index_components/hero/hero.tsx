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
        src="/GG-Gloves-black.png"
        alt="Imagen frontal de los GG-Gloves"
        id="hero-img"
        width={940}
        height={540}
        loading="eager"
      />
      <h2>Confort y experiencia</h2>
    </main>
  );
}

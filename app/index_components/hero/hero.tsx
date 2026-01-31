import Image from 'next/image';
import './hero.css';

export default function Hero() {
  return (
    <main id="hero-container">
      <h1>
        Trabaja cómodo, <br />
        juega mejor
      </h1>
      <Image 
        src="/GG-Gloves-holding-mouse-2.png" 
        alt="Caso de uso de los GG-Gloves sosteniendo un mouse, visto desde abajo" 
        id="hero-img"
        width={1536} 
        height={1024}
        loading="eager" />
      <h2>Guantes que no paran en la ergonomía, también traen experiencia</h2>
    </main>
  )

}
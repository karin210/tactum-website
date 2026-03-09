"use client";

import Image from "next/image";
import "./product.css";
import { useEffect, useState } from "react";

export default function Product({
  title,
  subtitle,
  imgSrc,
  imgAlt,
  benefits,
}: {
  title: string;
  subtitle: string;
  imgSrc: string;
  imgAlt: string;
  benefits: {
    iconsSrc: string[];
    iconsAlt: string[];
    description: string[];
  };
}) {
  const [mounted, setMounted] = useState(false);
  const [benefitNum, setBenefitNum] = useState(0);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <article className="product-container">
      <h2 className="title">{title}</h2>
      <h3 className="subtitle">{subtitle}</h3>
      <img id="product-img" src={imgSrc} alt={imgAlt} />
      <section className="benefits">
        <button
          id="previous-benefit"
          className="benefits-nav-btn"
          onClick={() => setBenefitNum(Math.max(0, benefitNum - 1))}
        ></button>
        <div id="benefits-content">
          <Image
            className="benefit-icon"
            src={benefits.iconsSrc[benefitNum]}
            alt={benefits.iconsAlt[benefitNum]}
            width={38}
            height={38}
          />
          <p>{benefits.description[benefitNum]}</p>
        </div>
        <button
          id="next-benefit"
          className="benefits-nav-btn"
          onClick={() => setBenefitNum(Math.min(3, benefitNum + 1))}
        ></button>
      </section>
      {/* <button>Ver</button> */}
    </article>
  );
}

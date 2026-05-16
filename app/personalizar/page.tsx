"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

const PARTS = [
  { id: "front", label: "Frente" },
  { id: "back", label: "Dorso de la mano" },
  { id: "padding", label: "Acolchado de muñeca" },
] as const;

type PartId = (typeof PARTS)[number]["id"];

const COLORS = [
  { name: "Negro", hex: "#1A1A1A" },
  { name: "Blanco", hex: "#F0EEEA" },
  { name: "Marino", hex: "#1E3A5F" },
  { name: "Verde salvia", hex: "#3FAF85" },
  { name: "Terracota", hex: "#C4623A" },
  { name: "Carmesí", hex: "#bf1a4b" },
  { name: "Orquídea", hex: "#ea6bb3" },
  { name: "Espacio experior", hex: "#3c4544" },
  { name: "Rosa Cardo", hex: "#d8b0c1" },
  { name: "Vino Profundo", hex: "#642137" },
  { name: "Sombra azul", hex: "#3c5285" },
  { name: "Lavanda", hex: "#925f8b" },
  { name: "Glaciar", hex: "#51a0c1" },
];

const DETAILS = [
  { id: "neon", label: "Líneas neón" },
  { id: "hair", label: "Pelo" },
  { id: "claws", label: "Garras" },
  { id: "embroidery", label: "Bordado" },
];

const CLOSURES = [
  { id: "elastic", label: "Banda elástica" },
  { id: "magnetic", label: "Cierre magnético" },
  { id: "velcro", label: "Velcro" },
];

const STEPS = [
  { id: "color", label: "Color" },
  { id: "fabric", label: "Tipo de tela" },
  { id: "details", label: "Detalles" },
  { id: "closure", label: "Tipo de cierre" },
  { id: "logo", label: "Logo" },
  { id: "name", label: "Nombre" },
] as const;

export default function CustomizePage() {
  const [currentStep, setCurrentStep] = useState(0);

  const [colors, setColors] = useState<Record<PartId, string>>({
    front: COLORS[0].hex,
    back: COLORS[0].hex,
    padding: COLORS[0].hex,
  });

  function setPartColor(part: PartId, hex: string) {
    setColors((prev) => ({ ...prev, [part]: hex }));
  }

  const [fabric, setFabric] = useState<"single" | "double">("single");
  const [details, setDetails] = useState<Record<string, boolean>>({
    neon: false,
    hair: false,
    claws: false,
    embroidery: false,
  });
  const [closure, setClosure] = useState("elastic");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [gloveName, setGloveName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevLogoUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevLogoUrl.current) URL.revokeObjectURL(prevLogoUrl.current);
    };
  }, []);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (prevLogoUrl.current) URL.revokeObjectURL(prevLogoUrl.current);
    const url = URL.createObjectURL(file);
    prevLogoUrl.current = url;
    setLogoUrl(url);
  }

  function toggleDetail(id: string) {
    setDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function hidden(step: number) {
    return currentStep !== step ? styles.stepHidden : "";
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Personaliza tus guantes</h1>

      <div className={styles.layout}>
        <div className={styles.formArea}>

          {/* Progress bar — mobile only */}
          <div
            className={styles.progressBar}
            role="navigation"
            aria-label="Pasos de personalización"
          >
            {STEPS.map((step, i) => (
              <Fragment key={step.id}>
                <button
                  type="button"
                  className={`${styles.stepDot} ${i < currentStep ? styles.stepDotDone : ""} ${i === currentStep ? styles.stepDotActive : ""}`}
                  onClick={() => { if (i < currentStep) setCurrentStep(i); }}
                  aria-current={i === currentStep ? "step" : undefined}
                  aria-label={`Paso ${i + 1}: ${step.label}`}
                  tabIndex={i >= currentStep ? -1 : 0}
                >
                  {i < currentStep ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span aria-hidden="true">{i + 1}</span>
                  )}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`${styles.stepLine} ${i < currentStep ? styles.stepLineDone : ""}`}
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </div>

          {/* Image placeholder — mobile only */}
          <div className={styles.imagePlaceholderInline} aria-hidden="true">
            <span className={styles.placeholderText}>Vista previa del guante</span>
          </div>

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>

            {/* 1. Color */}
            <fieldset className={`${styles.section} ${hidden(0)}`}>
              <legend className={styles.legend}>Color</legend>
              {PARTS.map((part) => {
                if (part.id === "back" && fabric !== "double") return null;
                return (
                  <div key={part.id} className={styles.colorPart}>
                    <p className={styles.colorPartLabel}>{part.label}</p>
                    <div className={styles.colorGrid}>
                      {COLORS.map((c) => (
                        <label key={c.hex} className={styles.colorOption} title={c.name}>
                          <input
                            type="radio"
                            name={`color-${part.id}`}
                            value={c.hex}
                            checked={colors[part.id] === c.hex}
                            onChange={() => setPartColor(part.id, c.hex)}
                            className={styles.srOnly}
                          />
                          <span
                            className={`${styles.swatch} ${colors[part.id] === c.hex ? styles.swatchActive : ""}`}
                            style={{ backgroundColor: c.hex }}
                            aria-hidden="true"
                          />
                          <span className={styles.colorName}>{c.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </fieldset>

            {/* 2. Fabric type */}
            <fieldset className={`${styles.section} ${hidden(1)}`}>
              <legend className={styles.legend}>Tipo de tela</legend>
              <div className={styles.fabricGrid}>
                {(["single", "double"] as const).map((type) => (
                  <label
                    key={type}
                    className={`${styles.fabricOption} ${fabric === type ? styles.fabricActive : ""}`}
                  >
                    <input
                      type="radio"
                      name="fabric"
                      value={type}
                      checked={fabric === type}
                      onChange={() => setFabric(type)}
                      className={styles.srOnly}
                    />
                    <span className={styles.fabricIcon} aria-hidden="true">
                      {type === "single" ? "▪" : "◧"}
                    </span>
                    <span className={styles.fabricLabel}>
                      {type === "single" ? "Tela única" : "Doble tela"}
                    </span>
                    <span className={styles.fabricDesc}>
                      {type === "single"
                        ? "Una sola tela en toda la superficie del guante"
                        : "Tela diferente para la palma y el dorso de la mano"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 3. Additional details */}
            <fieldset className={`${styles.section} ${hidden(2)}`}>
              <legend className={styles.legend}>Detalles adicionales</legend>
              <div className={styles.detailsGrid}>
                {DETAILS.map((d) => (
                  <label
                    key={d.id}
                    className={`${styles.detailOption} ${details[d.id] ? styles.detailActive : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={details[d.id]}
                      onChange={() => toggleDetail(d.id)}
                      className={styles.srOnly}
                    />
                    <span
                      className={`${styles.checkmark} ${details[d.id] ? styles.checkmarkActive : ""}`}
                      aria-hidden="true"
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 4. Closure type */}
            <fieldset className={`${styles.section} ${hidden(3)}`}>
              <legend className={styles.legend}>Tipo de cierre</legend>
              <div className={styles.closureGrid}>
                {CLOSURES.map((c) => (
                  <label
                    key={c.id}
                    className={`${styles.closureOption} ${closure === c.id ? styles.closureActive : ""}`}
                  >
                    <input
                      type="radio"
                      name="closure"
                      value={c.id}
                      checked={closure === c.id}
                      onChange={() => setClosure(c.id)}
                      className={styles.srOnly}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* 5. Logo */}
            <fieldset className={`${styles.section} ${hidden(4)}`}>
              <legend className={styles.legend}>Logo</legend>
              <button
                type="button"
                className={styles.uploadZone}
                onClick={() => fileInputRef.current?.click()}
                aria-label={
                  logoUrl ? "Cambiar imagen de logo" : "Subir imagen de logo"
                }
              >
                {logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={logoUrl}
                    alt="Logo personalizado"
                    className={styles.logoPreview}
                  />
                ) : (
                  <span className={styles.uploadPlaceholder}>
                    Haz clic para subir una imagen
                  </span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className={styles.srOnly}
                aria-label="Subir logo"
              />
            </fieldset>

            {/* 6. Name */}
            <fieldset className={`${styles.section} ${hidden(5)}`}>
              <legend className={styles.legend}>Nombre</legend>
              <label className={styles.nameLabel} htmlFor="glove-name">
                Texto bordado o estampado en el guante
              </label>
              <input
                id="glove-name"
                type="text"
                value={gloveName}
                onChange={(e) => setGloveName(e.target.value)}
                placeholder="Ej. Tu nombre o equipo"
                maxLength={30}
                className={styles.nameInput}
              />
              <span className={styles.charCount} aria-live="polite">
                {gloveName.length}/30
              </span>
            </fieldset>

            {/* Step navigation — mobile only */}
            <div className={styles.stepNav}>
              <button
                type="button"
                className={styles.stepNavBtn}
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
              >
                Anterior
              </button>
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  className={styles.stepNavBtnPrimary}
                  onClick={() => setCurrentStep((s) => s + 1)}
                >
                  Siguiente
                </button>
              ) : (
                <button type="submit" className={styles.stepNavBtnPrimary}>
                  Agregar al carrito
                </button>
              )}
            </div>

            {/* Submit — desktop only */}
            <button type="submit" className={`${styles.submitBtn} ${styles.submitBtnDesktop}`}>
              Agregar al carrito
            </button>

          </form>
        </div>

        {/* Image placeholder — desktop only */}
        <div className={styles.imagePlaceholderSide} aria-hidden="true">
          <span className={styles.placeholderText}>Vista previa del guante</span>
        </div>
      </div>
    </main>
  );
}

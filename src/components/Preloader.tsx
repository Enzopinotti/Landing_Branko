"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Preloader.module.scss";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // 1. Apparición inicial del logo con resplandor
    tl.fromTo(
      [logoRef.current, glowRef.current],
      { 
        scale: 0.8, 
        opacity: 0,
        filter: "blur(20px)"
      },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.1
      }
    )
    // 2. Disparar el brillo metálico (shine)
    .add(() => {
      logoRef.current?.classList.add(styles.logoShine);
    })
    // 3. Pequeño latido de luz
    .to(glowRef.current, {
      scale: 1.2,
      opacity: 0.5,
      duration: 1,
      repeat: 1,
      yoyo: true,
      ease: "sine.inOut"
    })
    // 4. El logo se traslada a la esquina
    .to(logoRef.current, {
      x: "-42vw",
      y: "-44vh",
      scale: 0.3,
      duration: 1.2,
      ease: "power4.inOut",
    })
    // 5. Fade out del preloader
    .to(containerRef.current, {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.8,
      ease: "power2.inOut",
    }, "-=0.6");

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={glowRef} className={styles.glow} />
      <div className={styles.content}>
        <div ref={logoRef} className={styles.logo}>
          BI
        </div>
      </div>
    </div>
  );
}

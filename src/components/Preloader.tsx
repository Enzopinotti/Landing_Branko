"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Preloader.module.scss";
import brankoMonogram from "../assets/branko-monogram.svg";

interface PreloaderProps {
  ready: boolean;
  onComplete: () => void;
}

export default function Preloader({ ready, onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(ready);
  const introFinishedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const startExitRef = useRef<() => void>(() => undefined);

  readyRef.current = ready;

  useEffect(() => {
    if (ready && introFinishedRef.current) startExitRef.current();
  }, [ready]);

  useGSAP(() => {
    let glowPulse: gsap.core.Tween | null = null;
    let logoBreath: gsap.core.Tween | null = null;

    const startWaitingMotion = () => {
      glowPulse = gsap.to(glowRef.current, {
        scale: 1.22,
        opacity: 0.52,
        duration: 1.65,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      logoBreath = gsap.to(logoRef.current, {
        scale: 1.018,
        duration: 1.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    };

    const startExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      glowPulse?.kill();
      logoBreath?.kill();

      gsap.timeline({ onComplete })
        .to(glowRef.current, {
          scale: 1.35,
          opacity: 0.18,
          duration: 0.55,
          ease: "power2.out",
        })
        .to(logoRef.current, {
          x: "-42vw",
          y: "-44vh",
          scale: 0.3,
          duration: 1.35,
          ease: "power4.inOut",
        }, "-=0.2")
        .to(containerRef.current, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.9,
          ease: "power2.inOut",
        }, "-=0.7");
    };

    startExitRef.current = startExit;

    gsap.timeline()
      .fromTo(
        [logoRef.current, glowRef.current],
        {
          scale: 0.8,
          opacity: 0,
          filter: "blur(20px)",
        },
        {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.35,
          ease: "expo.out",
          stagger: 0.12,
        },
      )
      .add(() => {
        logoRef.current?.classList.add(styles.logoShine);
      }, "-=0.1")
      .to({}, { duration: 2.35 })
      .add(() => {
        introFinishedRef.current = true;
        startWaitingMotion();
        if (readyRef.current) startExit();
      });

    return () => {
      glowPulse?.kill();
      logoBreath?.kill();
    };
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={glowRef} className={styles.glow} />
      <div className={styles.content}>
        <div ref={logoRef} className={styles.logo} aria-label="Branko Iriart">
          <img src={brankoMonogram} alt="" aria-hidden="true" className={styles.logoMark} />
        </div>
      </div>
    </div>
  );
}

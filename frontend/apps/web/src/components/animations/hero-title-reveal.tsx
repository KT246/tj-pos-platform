"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

type HeroTitleRevealProps = {
  title: string;
  accent: string;
  className?: string;
  accentClassName?: string;
};

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function renderAnimatedWords(words: string[], keyPrefix: string) {
  return words.map((word, index) => (
    <span key={`${keyPrefix}-${word}-${index}`}>
      <span data-title-word className="inline-block will-change-transform">
        {word}
      </span>
      {index < words.length - 1 ? " " : null}
    </span>
  ));
}

export function HeroTitleReveal({
  title,
  accent,
  className = "",
  accentClassName = ""
}: HeroTitleRevealProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleWords = useMemo(() => splitWords(title), [title]);
  const accentWords = useMemo(() => splitWords(accent), [accent]);
  const accessibleText = `${title} ${accent}`;

  useEffect(() => {
    const titleElement = titleRef.current;

    if (!titleElement) {
      return undefined;
    }

    const words = titleElement.querySelectorAll("[data-title-word]");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(words, { clearProps: "all" });

      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        words,
        {
          y: 24,
          opacity: 0,
          filter: "blur(8px)"
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.72,
          ease: "power3.out",
          stagger: 0.045,
          clearProps: "transform,opacity,filter"
        }
      );
    }, titleElement);

    return () => context.revert();
  }, [accessibleText]);

  return (
    <h1 ref={titleRef} className={className} aria-label={accessibleText}>
      <span aria-hidden="true">
        {renderAnimatedWords(titleWords, "title")}{" "}
        <span className={accentClassName}>
          {renderAnimatedWords(accentWords, "accent")}
        </span>
      </span>
    </h1>
  );
}

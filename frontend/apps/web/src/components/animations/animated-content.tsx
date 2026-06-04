"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AnimatedContentProps = {
  children: ReactNode;
  className?: string;
  container?: string | HTMLElement | null;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  id?: string;
};

const REVEAL_EVENT = "tj-pos:section-reveal";
const HEADER_OFFSET = 80;

function resolveScrollContainer(container?: string | HTMLElement | null) {
  if (!container) {
    return undefined;
  }

  return typeof container === "string"
    ? ((document.querySelector(container) as HTMLElement | null) ?? undefined)
    : container;
}

function getTriggerStart(threshold: number) {
  const viewportPoint = Math.round((1 - threshold) * 100);

  return `top ${Math.min(95, Math.max(5, viewportPoint))}%`;
}

function isNearViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
}

export function AnimatedContent({
  children,
  className = "",
  container = null,
  distance = 40,
  direction = "vertical",
  reverse = false,
  duration = 0.7,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.15,
  delay = 0,
  id
}: AnimatedContentProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(content, { clearProps: "all" });

      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const axis = direction === "horizontal" ? "x" : "y";
    const offset = reverse ? -distance : distance;
    const fromVars = {
      [axis]: offset,
      opacity: animateOpacity ? initialOpacity : 1,
      scale,
      willChange: "transform, opacity"
    };
    const toVars = {
      [axis]: 0,
      opacity: 1,
      scale: 1,
      duration,
      ease,
      delay,
      paused: true,
      onComplete: () => {
        gsap.set(content, { clearProps: "transform,opacity,willChange" });
      }
    };

    const tween = gsap.fromTo(content, fromVars, toVars);
    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      scroller: resolveScrollContainer(container),
      start: getTriggerStart(threshold),
      once: true,
      onEnter: () => tween.play(0)
    });
    const replayTimers = new Set<number>();

    const handleReveal = (event: Event) => {
      const targetId = (event as CustomEvent<{ id?: string }>).detail?.id;

      if (!id || targetId !== id) {
        return;
      }

      const playWhenVisible = () => {
        if (isNearViewport(wrapper)) {
          tween.play(0);
          return;
        }

        const timerId = window.setTimeout(() => {
          replayTimers.delete(timerId);
          playWhenVisible();
        }, 100);

        replayTimers.add(timerId);
      };

      playWhenVisible();
    };

    window.addEventListener(REVEAL_EVENT, handleReveal);

    return () => {
      window.removeEventListener(REVEAL_EVENT, handleReveal);
      replayTimers.forEach((timerId) => window.clearTimeout(timerId));
      trigger.kill();
      tween.kill();
    };
  }, [
    animateOpacity,
    container,
    delay,
    direction,
    distance,
    duration,
    ease,
    id,
    initialOpacity,
    reverse,
    scale,
    threshold
  ]);

  return (
    <div ref={wrapperRef} id={id} className={className}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export function revealSection(sectionId: string, delay = 250) {
  window.setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent(REVEAL_EVENT, {
        detail: { id: sectionId }
      })
    );
  }, delay);
}

export function scrollToSection(sectionId: string) {
  const target = document.getElementById(sectionId);

  if (!target) {
    return false;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth"
  });

  return true;
}

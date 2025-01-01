import { useLayoutEffect } from "react";

export interface InteractionObserverOptions {
  ref: React.RefObject<HTMLElement | null>;
  animateClass: string;
  enabled?: boolean;
  repeat?: boolean;
}

export default function useInteractionObserver({
  ref,
  animateClass,
  enabled = true,
  repeat,
}: InteractionObserverOptions) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const elementRef = ref.current;

    if (!elementRef) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.boundingClientRect.top > 0) {
          if (entry.isIntersecting) {
            entry.target.classList.add(animateClass);
          } else if (repeat) {
            entry.target.classList.remove(animateClass);
          }
        }
      });
    });

    observer.observe(elementRef);

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef);
        elementRef.classList.remove(animateClass);
      }
    };
  }, [animateClass, enabled, ref, repeat]);
}

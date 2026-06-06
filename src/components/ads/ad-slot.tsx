'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  script: string;
  className?: string;
}

export function AdSlot({ script, className }: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !script) return;
    const container = ref.current;
    container.innerHTML = '';

    const temp = document.createElement('div');
    temp.innerHTML = script;

    // Re-create script tags so the browser executes them
    temp.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      container.appendChild(s);
      old.remove();
    });

    Array.from(temp.childNodes).forEach((node) => container.appendChild(node.cloneNode(true)));
  }, [script]);

  if (!script) return null;
  return <div ref={ref} className={className} />;
}

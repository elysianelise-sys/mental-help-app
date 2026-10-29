import { useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';

/**
 * Lets a horizontally scrolling row be dragged with a mouse (touch and trackpads already scroll).
 * With `snap`, the row settles on the nearest child after the drag. A drag never counts as a click.
 */
export function useDragScroll<T extends HTMLElement>({ snap = false }: { snap?: boolean } = {}) {
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const skipClick = useRef(false);

  const step = (el: T) => {
    const [a, b] = Array.from(el.children) as HTMLElement[];
    return b && a ? b.offsetLeft - a.offsetLeft : el.clientWidth;
  };

  const onPointerDown = (event: PointerEvent<T>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
  };

  const onPointerMove = (event: PointerEvent<T>) => {
    const state = drag.current;
    if (!state) return;
    const el = event.currentTarget;
    const dx = event.clientX - state.x;
    if (!state.moved && Math.abs(dx) > 4) {
      state.moved = true;
      el.style.scrollSnapType = 'none';
      el.style.cursor = 'grabbing';
      el.setPointerCapture(event.pointerId);
    }
    if (state.moved) el.scrollLeft = state.left - dx;
  };

  const end = (event: PointerEvent<T>) => {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    const el = event.currentTarget;
    el.style.cursor = '';
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    el.style.scrollSnapType = '';
    if (snap) {
      const last = el.children.length - 1;
      const index = Math.max(0, Math.min(last, Math.round(el.scrollLeft / step(el))));
      el.scrollTo({ left: index * step(el), behavior: 'smooth' });
    }
    skipClick.current = true;
    window.setTimeout(() => {
      skipClick.current = false;
    }, 0);
  };

  const onClickCapture = (event: MouseEvent<T>) => {
    if (skipClick.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return {
    step,
    props: { onPointerDown, onPointerMove, onPointerUp: end, onPointerCancel: end, onClickCapture },
  };
}

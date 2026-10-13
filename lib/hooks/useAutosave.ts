"use client";

import { useEffect, useRef } from "react";

// Değer değiştikten `delayMs` sonra onSave'i çağırır (debounce). İlk render'da
// (mount anında) tetiklenmez — sadece kullanıcı gerçekten bir şey değiştirdiğinde
// kaydeder. `value`'nun içeriği JSON.stringify ile karşılaştırılır, böylece her
// render'da yeniden oluşturulan obje/array referansları gereksiz kayda yol açmaz.
export function useAutosave<T>(value: T, onSave: ((value: T) => void) | undefined, delayMs = 800) {
  const isFirstRun = useRef(true);
  const serialized = JSON.stringify(value);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!onSave) return;
    const timer = setTimeout(() => onSave(value), delayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);
}

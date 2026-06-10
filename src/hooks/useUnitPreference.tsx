import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface UnitPreferenceContextValue {
  metricFirst: boolean;
  toggle: () => void;
}

const UnitPreferenceContext = createContext<UnitPreferenceContextValue>({
  metricFirst: false,
  toggle: () => {},
});

export function UnitPreferenceProvider({ children }: { children: ReactNode }) {
  const [metricFirst, setMetricFirst] = useState(() =>
    localStorage.getItem('unitOrder') === 'metric'
  );

  function toggle() {
    const next = !metricFirst;
    setMetricFirst(next);
    localStorage.setItem('unitOrder', next ? 'metric' : 'imperial');
  }

  return (
    <UnitPreferenceContext.Provider value={{ metricFirst, toggle }}>
      {children}
    </UnitPreferenceContext.Provider>
  );
}

export function useUnitPreference() {
  return useContext(UnitPreferenceContext);
}

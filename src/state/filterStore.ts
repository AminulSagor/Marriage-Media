// src/state/filterStore.ts
// A tiny global store for filters, persisted via AsyncStorage and shared by screens.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useSyncExternalStore} from 'react';

export type FilterValues = {
  gender?: 'Male' | 'Female' | 'Any';
  ageMin?: number;
  ageMax?: number;
  distance?: number;
  country?: string;
  city?: string;
  maritalStatus?: string;
  religion?: string;
  ethnicity?: string;
  sect?: string;
  occupation?: string;
  education?: string;
  bodyType?: string;
  height?: string | number;
  heightUnit?: 'cm' | 'ft';
  weight?: string | number;
  weightUnit?: 'kg' | 'lbs';
  hair?: string;
  eye?: string;
  skin?: string;
};

export const DEFAULT_FILTERS: Required<FilterValues> = {
  gender: 'Any',
  ageMin: 18,
  ageMax: 99,
  distance: 50,
  country: 'Any',
  city: 'Any',
  maritalStatus: 'Any',
  religion: 'Any',
  ethnicity: 'Any',
  sect: 'Any',
  occupation: 'Any',
  education: 'Any',
  bodyType: 'Any',
  height: '',
  heightUnit: 'cm',
  weight: '',
  weightUnit: 'kg',
  hair: 'Any',
  eye: 'Any',
  skin: 'Any',
};

const STORAGE_KEY = 'FILTERS_V1';

let filters: FilterValues = {...DEFAULT_FILTERS};
let hydrated = false;

type Snapshot = {filters: FilterValues; hydrated: boolean};
let snapshot: Snapshot = {filters, hydrated};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}
function updateSnapshot() {
  snapshot = {filters, hydrated};
  emit();
}

export function getFilters() {
  // ✅ stable reference unless state actually changes
  return snapshot;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {}
}

export async function hydrateFilters() {
  if (hydrated) return;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      filters = {...DEFAULT_FILTERS, ...JSON.parse(raw)};
    }
  } catch {}
  hydrated = true;
  updateSnapshot();
}

export function setFilters(next: FilterValues) {
  filters = {...filters, ...next};
  void persist();
  updateSnapshot();
}

export function replaceFilters(next: FilterValues) {
  filters = {...DEFAULT_FILTERS, ...next};
  void persist();
  updateSnapshot();
}

export function resetFilters() {
  filters = {...DEFAULT_FILTERS};
  void persist();
  updateSnapshot();
}

// React hook to consume the store
export function useFilterStore() {
  const state = useSyncExternalStore(subscribe, getFilters, getFilters);
  useEffect(() => {
    if (!state.hydrated) void hydrateFilters();
  }, [state.hydrated]);
  return {
    filters: state.filters,
    hydrated: state.hydrated,
    set: setFilters,
    replace: replaceFilters,
    reset: resetFilters,
  };
}

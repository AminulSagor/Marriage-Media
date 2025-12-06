// src/state/filterStore.ts
// Runtime-only global store for filters (no AsyncStorage).

import {useSyncExternalStore} from 'react';
import type {UserProfile} from '../api/profile';

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

let filters: FilterValues = {...DEFAULT_FILTERS};
let hydrated = true; // runtime-only, always true

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
  return snapshot;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setFilters(next: FilterValues) {
  filters = {...filters, ...next};
  updateSnapshot();
}

export function replaceFilters(next: FilterValues) {
  filters = {...DEFAULT_FILTERS, ...next};
  updateSnapshot();
}

export function resetFilters() {
  filters = {...DEFAULT_FILTERS};
  updateSnapshot();
}

// 🔹 Map UserProfile -> FilterValues (used by HeartScreen)
export function mapProfileToFilters(p: UserProfile): Partial<FilterValues> {
  const out: Partial<FilterValues> = {};

  const toNum = (v: any): number | undefined => {
    if (v === undefined || v === null || v === '') return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  // Age range from preferred partner
  const minAge = toNum(p.prefered_partner_age_start);
  const maxAge = toNum(p.prefered_partner_age_end);
  if (minAge !== undefined) out.ageMin = minAge;
  if (maxAge !== undefined) out.ageMax = maxAge;

  // Distance
  const dist = toNum(p.prefered_partner_distance_range);
  if (dist !== undefined) out.distance = dist;

  // Country / city – fall back to user’s own if exist
  if (p.country) out.country = p.country;
  if (p.city) out.city = p.city;

  // Marital status: use preferred first, then own
  if (p.prefered_partner_marital_status) {
    out.maritalStatus = p.prefered_partner_marital_status;
  } else if (p.marital_status) {
    out.maritalStatus = p.marital_status;
  }

  // Religion
  if (p.prefered_partner_religion) {
    out.religion = p.prefered_partner_religion;
  } else if (p.religion) {
    out.religion = p.religion;
  }

  // Ethnicity
  if (p.prefered_partner_ethnicity) {
    out.ethnicity = p.prefered_partner_ethnicity;
  } else if (p.ethnicity) {
    out.ethnicity = p.ethnicity;
  }

  // Sect
  if (p.prefered_partner_religion_section) {
    out.sect = p.prefered_partner_religion_section;
  } else if (p.religion_section) {
    out.sect = p.religion_section;
  }

  // Occupation (profession)
  if (p.prefered_partner_occupation) {
    out.occupation = p.prefered_partner_occupation;
  } else if (p.profession) {
    out.occupation = p.profession;
  }

  // Education
  if (p.prefered_partner_education) {
    out.education = p.prefered_partner_education;
  } else if (p.education) {
    out.education = p.education;
  }

  // Body / appearance – only set if user has values, otherwise keep "Any"
  if (p.body_type) out.bodyType = p.body_type;
  if (p.hair_color) out.hair = p.hair_color;
  if (p.eye_color) out.eye = p.eye_color;
  if (p.skin_color) out.skin = p.skin_color;

  // gender filter: keep 'Any' for now – or you can invert user gender if you want
  // if (p.gender?.toLowerCase() === 'male') out.gender = 'Female';
  // if (p.gender?.toLowerCase() === 'female') out.gender = 'Male';

  return out;
}

// React hook to consume the store
export function useFilterStore() {
  const state = useSyncExternalStore(subscribe, getFilters, getFilters);
  return {
    filters: state.filters,
    hydrated: state.hydrated, // always true in this runtime-only version
    set: setFilters,
    replace: replaceFilters,
    reset: resetFilters,
  };
}

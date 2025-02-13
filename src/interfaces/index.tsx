export interface Register {
  key: string;
  data: number | null;
  desc: string;
}

export interface CacheMem {
  [key: string]: Register;
}

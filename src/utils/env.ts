
export function isProd(): boolean {
  return import.meta.env.MODE === 'production';
}

export function isStaging(): boolean {
  return import.meta.env.MODE === 'staging';
}

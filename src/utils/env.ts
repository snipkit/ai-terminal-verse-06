
export function isProd(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isStaging(): boolean {
  return process.env.NODE_ENV === 'staging';
}

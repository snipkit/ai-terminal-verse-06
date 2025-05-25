
interface WoWStatus {
  supported: boolean;
  reason?: string;
}

export const checkWoWStatus = (): WoWStatus => {
  // Check if WebAssembly is supported
  if (typeof WebAssembly === 'undefined') {
    return {
      supported: false,
      reason: 'WebAssembly not supported'
    };
  }

  // Check if SharedArrayBuffer is available (required for threading)
  if (typeof SharedArrayBuffer === 'undefined') {
    return {
      supported: false,
      reason: 'SharedArrayBuffer not available'
    };
  }

  // Check if the browser supports required features
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Very basic browser compatibility check
  if (userAgent.includes('chrome') || userAgent.includes('firefox') || userAgent.includes('safari')) {
    return { supported: true };
  }

  return {
    supported: false,
    reason: 'Browser not supported'
  };
};


export enum WarpEventKind {
  OpenOnNative = 'OpenOnNative',
}

export interface OpenOnNativeEvent {
  kind: WarpEventKind.OpenOnNative;
  url: string;
}

export type WarpEvent = OpenOnNativeEvent;

class WarpEventBus {
  private listeners: Array<(event: WarpEvent) => void> = [];

  addListener(listener: (event: WarpEvent) => void): () => void {
    this.listeners.push(listener);
    
    // Return a function to remove the listener
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(event: WarpEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in warp event listener:', error);
      }
    });
  }
}

export const warpEventBus = new WarpEventBus();

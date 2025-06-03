export interface Theme {
  accent: string;
  background: string;
  details: 'lighter' | 'darker';
  foreground: string;
  terminal_colors: {
    bright: {
      black: string;
      blue: string;
      cyan: string;
      green: string;
      magenta: string;
      red: string;
      white: string;
      yellow: string;
    };
    normal: {
      black: string;
      blue: string;
      cyan: string;
      green: string;
      magenta: string;
      red: string;
      white: string;
      yellow: string;
    };
  };
}

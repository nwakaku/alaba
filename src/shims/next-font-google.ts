type FontOptions = {
  variable?: string;
  weight?: string[] | string;
  subsets?: string[];
  display?: string;
};

function createFont(options: FontOptions) {
  return {
    variable: options.variable || "",
    className: options.variable?.replace(/^--/, "") || "",
  } as const;
}

export function Manrope(options: FontOptions) {
  return createFont(options);
}

export function Montserrat(options: FontOptions) {
  return createFont(options);
}



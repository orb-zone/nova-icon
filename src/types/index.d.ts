export interface IconDefinition {
  name: string;
  paths: string[];
  viewBox?: string;
  layers?: LayerConfig[];
}

export interface LayerConfig {
  weight?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
}

export interface ComponentState {
  icon: string | null;
  size: string;
  color: string;
  isAnimating: boolean;
  reducedMotion: boolean;
}

export interface RegistryState {
  definitions: Map<string, IconDefinition>;
  defsContainer: SVGDefsElement | null;
  usageCounts?: Map<string, number>;
}

export interface IconConfig {
  icons: Record<string, IconEntry>;
}

export interface IconEntry {
  paths: string[];
  viewBox?: string;
  layers?: LayerConfig[];
}
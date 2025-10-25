import { describe, it, expect } from 'bun:test';
import { validateIconConfig } from '../../src/runtime/validator';

describe('Schema Validation - Valid Configs', () => {
  it('should validate a basic icon config', () => {
    const config = {
      icons: {
        'arrow-right': {
          paths: ['M5 12h14', 'M12 5l7 7-7 7'],
          viewBox: '0 0 24 24',
        },
      },
    };
    const result = validateIconConfig(config);
    expect(result.valid).toBe(true);
  });

  it('should validate config with layers', () => {
    const config = {
      icons: {
        'check': {
          paths: ['M20 6L9 17l-5-5'],
          layers: [
            { weight: 1, duration: 300 },
            { weight: 2, duration: 400, stagger: 100 },
          ],
        },
      },
    };
    const result = validateIconConfig(config);
    expect(result.valid).toBe(true);
  });
});
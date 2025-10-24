import { describe, it, expect } from 'bun:test';
import { validateIconConfig } from '../../src/runtime/validator';

describe('Schema Validation - Invalid Configs', () => {
  it('should reject config without icons', () => {
    const config = {};
    const result = validateIconConfig(config);
    expect(result.valid).toBe(false);
  });

  it('should reject invalid icon name', () => {
    const config = {
      icons: {
        'Invalid-Name': {
          paths: ['M5 12h14'],
        },
      },
    };
    const result = validateIconConfig(config);
    expect(result.valid).toBe(false);
  });

  it('should reject empty paths', () => {
    const config = {
      icons: {
        'arrow': {
          paths: [],
        },
      },
    };
    const result = validateIconConfig(config);
    expect(result.valid).toBe(false);
  });

  it('should reject invalid layer properties', () => {
    const config = {
      icons: {
        'arrow': {
          paths: ['M5 12h14'],
          layers: [
            { weight: 0, duration: -100 },
          ],
        },
      },
    };
    const result = validateIconConfig(config);
    expect(result.valid).toBe(false);
  });
});
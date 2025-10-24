import { describe, it, expect } from 'bun:test';
import Ajv from 'ajv';
import schema from '../../specs/001-package-setup/contracts/component-schema.json';

describe('JSON Schema Contract', () => {
  it('should be a valid JSON Schema', () => {
    const ajv = new Ajv();
    const isValid = ajv.validateSchema(schema);
    expect(isValid).toBe(true);
  });
});
});
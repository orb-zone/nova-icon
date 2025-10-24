import { describe, it, expect } from 'bun:test';
import Ajv from 'ajv';
import schema from '../../contracts/component-schema.json';

describe('JSON Schema Contract', () => {
  it('should be a valid JSON Schema', () => {
    const ajv = new Ajv({ strict: false });
    const isValid = ajv.validateSchema(schema);
    expect(isValid).toBe(true);
  });
});
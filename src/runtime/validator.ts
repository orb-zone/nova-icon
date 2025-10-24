import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../specs/001-package-setup/contracts/component-schema.json';

const ajv = new Ajv();
addFormats(ajv);

const validate = ajv.compile(schema);

export function validateIconConfig(config: unknown): { valid: boolean; errors?: any[] } {
  const valid = validate(config);
  return {
    valid: !!valid,
    errors: validate.errors || undefined,
  };
}

export { schema };
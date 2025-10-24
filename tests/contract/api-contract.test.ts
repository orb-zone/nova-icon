import { describe, it, expect, beforeEach } from 'bun:test';

describe('NovaIcon.register() API Contract', () => {
  beforeEach(() => {
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
  });

  it('should have static register method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.register).toBe('function');
  });

  it('should have static registerBatch method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.registerBatch).toBe('function');
  });

  it('should have static get method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.get).toBe('function');
  });

  it('should have static has method', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(typeof NovaIconRegistry.has).toBe('function');
  });

  it('should accept name, pathData, and optional options', () => {
    const { NovaIconRegistry } = require('../../src/runtime/registry');
    expect(() => {
      NovaIconRegistry.register('test-icon', 'M10 10 L20 20');
    }).not.toThrow();
  });
});

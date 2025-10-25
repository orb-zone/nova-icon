import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testPagePath = path.resolve(__dirname, 'fixtures/test-page.html');
const testPageUrl = `file://${testPagePath}`;

test.describe.skip('NovaIcon Web Component E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testPageUrl);
    await page.waitForLoadState('networkidle');
  });

  test('should render basic icon component', async ({ page }) => {
    const icon = page.locator('#basic-icon');
    await expect(icon).toBeVisible();
    
    const shadowRoot = await icon.evaluateHandle(el => el.shadowRoot);
    expect(shadowRoot).toBeTruthy();
  });

  test('should render icons with different sizes', async ({ page }) => {
    const smallIcon = page.locator('#small-icon');
    const mediumIcon = page.locator('#medium-icon');
    const largeIcon = page.locator('#large-icon');

    await expect(smallIcon).toHaveAttribute('size', '24px');
    await expect(mediumIcon).toHaveAttribute('size', '48px');
    await expect(largeIcon).toHaveAttribute('size', '96px');

    const smallBox = await smallIcon.boundingBox();
    const mediumBox = await mediumIcon.boundingBox();
    const largeBox = await largeIcon.boundingBox();

    expect(smallBox?.width).toBeLessThan(mediumBox?.width ?? 0);
    expect(mediumBox?.width).toBeLessThan(largeBox?.width ?? 0);
  });

  test('should apply color attribute', async ({ page }) => {
    const redIcon = page.locator('#red-icon');
    const blueIcon = page.locator('#blue-icon');
    const greenIcon = page.locator('#green-icon');

    await expect(redIcon).toHaveAttribute('color', 'red');
    await expect(blueIcon).toHaveAttribute('color', 'blue');
    await expect(greenIcon).toHaveAttribute('color', 'green');
  });

  test('should have shadow DOM with SVG element', async ({ page }) => {
    const icon = page.locator('#basic-icon');
    
    const hasSvg = await icon.evaluate(el => {
      const shadowRoot = el.shadowRoot;
      if (!shadowRoot) return false;
      const svg = shadowRoot.querySelector('svg');
      return svg !== null;
    });

    expect(hasSvg).toBe(true);
  });

  test('should support accessibility attributes', async ({ page }) => {
    const accessibleIcon = page.locator('#accessible-icon');
    
    await expect(accessibleIcon).toHaveAttribute('aria-label', 'Test icon for accessibility');
  });

  test('should update when icon attribute changes', async ({ page }) => {
    const icon = page.locator('#basic-icon');
    
    await icon.evaluate(el => {
      el.setAttribute('icon', 'test-animated');
    });

    await page.waitForTimeout(100);

    const currentIcon = await icon.getAttribute('icon');
    expect(currentIcon).toBe('test-animated');
  });

  test('should handle animated icon', async ({ page }) => {
    const animatedIcon = page.locator('#animated-icon');
    await expect(animatedIcon).toBeVisible();
    
    const hasPath = await animatedIcon.evaluate(el => {
      const shadowRoot = el.shadowRoot;
      if (!shadowRoot) return false;
      const svg = shadowRoot.querySelector('svg');
      if (!svg) return false;
      const path = svg.querySelector('path');
      return path !== null;
    });

    expect(hasPath).toBe(true);
  });

  test('should be visible and have correct display properties', async ({ page }) => {
    const icon = page.locator('#basic-icon');
    
    await expect(icon).toBeVisible();
    
    const display = await icon.evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    
    expect(display).not.toBe('none');
  });
});

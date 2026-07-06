import { test as base, type Page } from '@playwright/test';

export type TestFixtures = {
  /** Skip auth — use for public pages only */
  page: Page;
};

export const test = base;
export { expect, type Page } from '@playwright/test';

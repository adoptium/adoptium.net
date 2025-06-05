import "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";
import "@testing-library/jest-dom";

declare module "vitest" {
  interface Assertion extends AxeMatchers, CustomMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers, CustomMatchers {}
}

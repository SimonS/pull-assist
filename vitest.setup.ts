import { vi } from "vitest";
import "@testing-library/dom";

// Mock chrome API
global.chrome = {
  runtime: {
    onMessage: {
      addListener: vi.fn(),
    },
    sendMessage: vi.fn(),
  },
  storage: {
    sync: {
      get: vi.fn(),
    },
  },
} as any;

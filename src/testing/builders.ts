import { USSDApp, createApp, createScreen, goToScreen, endSession, END_SESSION } from '../core';

/**
 * Helper to quickly build a simple test app
 */
export function createTestApp(screens: Record<string, { text: string; routes: Record<string, string> }>): USSDApp {
  const screenObjects: Record<string, ReturnType<typeof createScreen>> = {};

  for (const [id, screen] of Object.entries(screens)) {
    const routes: Record<string, any> = {};
    for (const [key, target] of Object.entries(screen.routes)) {
      routes[key] = target === 'END' ? END_SESSION : target;
    }
    screenObjects[id] = createScreen({
      text: screen.text,
      on: routes,
    });
  }

  return createApp({
    entryScreenId: Object.keys(screenObjects)[0],
    screens: screenObjects,
  });
}

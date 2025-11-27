import { createApp, createScreen, END_SESSION } from '../core.js';
/**
 * Helper to quickly build a simple test app
 */
export function createTestApp(screens) {
    const screenObjects = {};
    for (const [id, screen] of Object.entries(screens)) {
        const routes = {};
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

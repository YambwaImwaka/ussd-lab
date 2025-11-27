import { END_SESSION } from './types.js';
/**
 * Factory function to create a USSD app
 */
export function createApp(config) {
    return {
        entryScreenId: config.entryScreenId,
        screens: config.screens,
        defaultHandler: config.defaultHandler,
        sessionTimeout: config.sessionTimeout ?? 5 * 60 * 1000, // 5 minutes default
        maxScreens: config.maxScreens ?? 50,
    };
}
/**
 * Factory function to create a screen
 */
export function createScreen(config) {
    return {
        text: config.text,
        on: config.on,
        handler: config.handler,
    };
}
/**
 * Helper to end a session from a handler
 */
export function endSession(data) {
    return {
        endSession: true,
        session: data,
    };
}
/**
 * Helper to move to next screen from a handler
 */
export function goToScreen(screenId, data) {
    return {
        nextScreen: screenId,
        session: data,
    };
}
/**
 * Export END_SESSION symbol for convenience
 */
export { END_SESSION };

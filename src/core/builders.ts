import { USSDApp, Screen, ScreenRoutes, ScreenHandler, END_SESSION } from './types';

/**
 * Factory function to create a USSD app
 */
export function createApp(config: USSDApp): USSDApp {
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
export function createScreen(config: {
  text: string;
  on: ScreenRoutes;
  handler?: ScreenHandler;
}): Screen {
  return {
    text: config.text,
    on: config.on,
    handler: config.handler,
  };
}

/**
 * Helper to end a session from a handler
 */
export function endSession(data?: Record<string, unknown>): {
  endSession: boolean;
  session?: Record<string, unknown>;
} {
  return {
    endSession: true,
    session: data,
  };
}

/**
 * Helper to move to next screen from a handler
 */
export function goToScreen(
  screenId: string,
  data?: Record<string, unknown>
): { nextScreen: string; session?: Record<string, unknown> } {
  return {
    nextScreen: screenId,
    session: data,
  };
}

/**
 * Export END_SESSION symbol for convenience
 */
export { END_SESSION };

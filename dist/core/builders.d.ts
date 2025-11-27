import { USSDApp, Screen, ScreenRoutes, ScreenHandler, END_SESSION } from './types';
/**
 * Factory function to create a USSD app
 */
export declare function createApp(config: USSDApp): USSDApp;
/**
 * Factory function to create a screen
 */
export declare function createScreen(config: {
    text: string;
    on: ScreenRoutes;
    handler?: ScreenHandler;
}): Screen;
/**
 * Helper to end a session from a handler
 */
export declare function endSession(data?: Record<string, unknown>): {
    endSession: boolean;
    session?: Record<string, unknown>;
};
/**
 * Helper to move to next screen from a handler
 */
export declare function goToScreen(screenId: string, data?: Record<string, unknown>): {
    nextScreen: string;
    session?: Record<string, unknown>;
};
/**
 * Export END_SESSION symbol for convenience
 */
export { END_SESSION };
//# sourceMappingURL=builders.d.ts.map
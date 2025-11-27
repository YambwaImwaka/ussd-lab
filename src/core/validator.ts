import {
  USSDApp,
  ValidationResult,
  USSDError,
  Screen,
  EndSession,
  END_SESSION,
} from './types';

/**
 * Validates that a USSD app is correctly configured
 */
export class AppValidator {
  validate(app: USSDApp): ValidationResult {
    const errors: ValidationResult['errors'] = [];

    // Check entry screen exists
    if (!app.screens[app.entryScreenId]) {
      errors.push({
        type: USSDError.INVALID_ENTRY_SCREEN,
        message: `Entry screen "${app.entryScreenId}" does not exist`,
        details: { entryScreenId: app.entryScreenId },
      });
    }

    // Check all screens are valid and routes are valid
    for (const [screenId, screen] of Object.entries(app.screens)) {
      this.validateScreen(screenId, screen, app, errors);
    }

    // Check for unreachable screens
    const reachable = this.findReachableScreens(app);
    for (const screenId of Object.keys(app.screens)) {
      if (!reachable.has(screenId)) {
        errors.push({
          type: USSDError.UNREACHABLE_SCREEN,
          message: `Screen "${screenId}" is unreachable from entry screen`,
          details: { screenId },
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateScreen(
    screenId: string,
    screen: Screen,
    app: USSDApp,
    errors: ValidationResult['errors']
  ): void {
    // Validate routes point to existing screens
    for (const [key, target] of Object.entries(screen.on)) {
      if (target === END_SESSION) {
        continue;
      }

      if (typeof target === 'symbol') {
        continue;
      }

      if (!app.screens[target]) {
        errors.push({
          type: USSDError.INVALID_ROUTE_TARGET,
          message: `Screen "${screenId}" routes to non-existent screen "${target}"`,
          details: { screenId, key, target },
        });
      }
    }
  }

  private findReachableScreens(app: USSDApp): Set<string> {
    const reachable = new Set<string>();
    const queue = [app.entryScreenId];

    while (queue.length > 0) {
      const screenId = queue.shift()!;
      if (reachable.has(screenId)) {
        continue;
      }

      reachable.add(screenId);
      const screen = app.screens[screenId];

      if (screen) {
        for (const target of Object.values(screen.on)) {
          if (target !== END_SESSION && typeof target !== 'symbol') {
            if (!reachable.has(target)) {
              queue.push(target);
            }
          }
        }
      }
    }

    return reachable;
  }
}

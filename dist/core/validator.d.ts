import { USSDApp, ValidationResult } from './types';
/**
 * Validates that a USSD app is correctly configured
 */
export declare class AppValidator {
    validate(app: USSDApp): ValidationResult;
    private validateScreen;
    private findReachableScreens;
}
//# sourceMappingURL=validator.d.ts.map
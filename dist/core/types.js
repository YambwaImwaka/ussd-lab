/**
 * Core types and interfaces for @yambwa/ussd-lab
 */
/**
 * Represents the end of a USSD session
 */
export const END_SESSION = Symbol('END_SESSION');
/**
 * Error types for USSD validation
 */
export var USSDError;
(function (USSDError) {
    USSDError["INVALID_ENTRY_SCREEN"] = "INVALID_ENTRY_SCREEN";
    USSDError["INVALID_ROUTE_TARGET"] = "INVALID_ROUTE_TARGET";
    USSDError["MISSING_SCREEN"] = "MISSING_SCREEN";
    USSDError["DUPLICATE_SCREEN"] = "DUPLICATE_SCREEN";
    USSDError["UNREACHABLE_SCREEN"] = "UNREACHABLE_SCREEN";
    USSDError["CIRCULAR_REFERENCE"] = "CIRCULAR_REFERENCE";
    USSDError["INVALID_INPUT"] = "INVALID_INPUT";
    USSDError["SESSION_TIMEOUT"] = "SESSION_TIMEOUT";
    USSDError["MAX_SCREENS_EXCEEDED"] = "MAX_SCREENS_EXCEEDED";
})(USSDError || (USSDError = {}));

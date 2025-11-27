import { Session } from '../core/types';
/**
 * Assert that the session is on a specific screen
 */
export declare function assertScreen(session: Session, expectedScreenId: string): void;
/**
 * Assert that the session has ended
 */
export declare function assertEnded(session: Session): void;
/**
 * Assert that the session has not ended
 */
export declare function assertNotEnded(session: Session): void;
/**
 * Assert that the last output contains a specific string
 */
export declare function assertOutputContains(session: Session, text: string): void;
/**
 * Assert that any output in the session contains a specific string
 */
export declare function assertAnyOutputContains(session: Session, text: string): void;
/**
 * Assert that the session visited a specific screen
 */
export declare function assertScreenVisited(session: Session, screenId: string): void;
/**
 * Assert that the session did not visit a specific screen
 */
export declare function assertScreenNotVisited(session: Session, screenId: string): void;
/**
 * Assert that the session has a specific number of steps
 */
export declare function assertStepCount(session: Session, expectedCount: number): void;
/**
 * Assert that the session has no errors
 */
export declare function assertNoErrors(session: Session): void;
/**
 * Assert that the session has a specific error
 */
export declare function assertHasError(session: Session, errorMessage: string): void;
/**
 * Get the last output text
 */
export declare function lastOutput(session: Session): string;
/**
 * Get the screen path as a string (for debugging)
 */
export declare function screenPath(session: Session): string;
//# sourceMappingURL=assertions.d.ts.map
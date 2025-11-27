import { Session } from '../core/types';

/**
 * Assert that the session is on a specific screen
 */
export function assertScreen(session: Session, expectedScreenId: string): void {
  if (session.currentScreenId !== expectedScreenId) {
    throw new Error(
      `Expected screen "${expectedScreenId}" but got "${session.currentScreenId}"`
    );
  }
}

/**
 * Assert that the session has ended
 */
export function assertEnded(session: Session): void {
  if (!session.ended) {
    throw new Error(
      `Expected session to have ended but it is still active on screen "${session.currentScreenId}"`
    );
  }
}

/**
 * Assert that the session has not ended
 */
export function assertNotEnded(session: Session): void {
  if (session.ended) {
    throw new Error(`Expected session to be active but it has ended`);
  }
}

/**
 * Assert that the last output contains a specific string
 */
export function assertOutputContains(session: Session, text: string): void {
  const lastOutput = session.outputs[session.outputs.length - 1];
  if (!lastOutput || !lastOutput.includes(text)) {
    throw new Error(
      `Expected output to contain "${text}" but got: "${lastOutput || '(empty)'}"`
    );
  }
}

/**
 * Assert that any output in the session contains a specific string
 */
export function assertAnyOutputContains(session: Session, text: string): void {
  const found = session.outputs.some((output) => output.includes(text));
  if (!found) {
    throw new Error(
      `Expected some output to contain "${text}" but no output did. Outputs: ${session.outputs.join(
        ' | '
      )}`
    );
  }
}

/**
 * Assert that the session visited a specific screen
 */
export function assertScreenVisited(session: Session, screenId: string): void {
  if (!session.transcript.includes(screenId)) {
    throw new Error(
      `Expected to visit screen "${screenId}" but transcript was: ${session.transcript.join(
        ' -> '
      )}`
    );
  }
}

/**
 * Assert that the session did not visit a specific screen
 */
export function assertScreenNotVisited(session: Session, screenId: string): void {
  if (session.transcript.includes(screenId)) {
    throw new Error(
      `Expected not to visit screen "${screenId}" but it was in transcript: ${session.transcript.join(
        ' -> '
      )}`
    );
  }
}

/**
 * Assert that the session has a specific number of steps
 */
export function assertStepCount(session: Session, expectedCount: number): void {
  if (session.steps.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount} steps but got ${session.steps.length}`
    );
  }
}

/**
 * Assert that the session has no errors
 */
export function assertNoErrors(session: Session): void {
  if (session.errors.length > 0) {
    throw new Error(
      `Expected no errors but got: ${session.errors.join(', ')}`
    );
  }
}

/**
 * Assert that the session has a specific error
 */
export function assertHasError(session: Session, errorMessage: string): void {
  const found = session.errors.some((error) => error.includes(errorMessage));
  if (!found) {
    throw new Error(
      `Expected error containing "${errorMessage}" but got: ${session.errors.join(
        ', '
      )}`
    );
  }
}

/**
 * Get the last output text
 */
export function lastOutput(session: Session): string {
  return session.outputs[session.outputs.length - 1] || '';
}

/**
 * Get the screen path as a string (for debugging)
 */
export function screenPath(session: Session): string {
  return session.transcript.join(' -> ');
}

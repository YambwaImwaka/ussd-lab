/**
 * Core types and interfaces for @yambwa/ussd-lab
 */

/**
 * Represents the end of a USSD session
 */
export const END_SESSION = Symbol('END_SESSION');
export type EndSession = typeof END_SESSION;

/**
 * Result of a handler function
 */
export interface HandlerResult {
  nextScreen?: string;
  endSession?: boolean;
  session?: Record<string, unknown>;
}

/**
 * Async handler for custom screen logic
 */
export type ScreenHandler = (
  input: string,
  session: Record<string, unknown>
) => Promise<HandlerResult> | HandlerResult;

/**
 * Routing rules for a screen
 */
export type ScreenRoutes = Record<string, string | EndSession>;

/**
 * Definition of a single USSD screen
 */
export interface Screen {
  /**
   * Text displayed to the user on this screen
   */
  text: string;

  /**
   * Routing rules: what happens when user presses each key
   */
  on: ScreenRoutes;

  /**
   * Optional custom handler for complex logic
   * If provided, this function is called and can override default routing
   */
  handler?: ScreenHandler;
}

/**
 * Complete USSD application definition
 */
export interface USSDApp {
  /**
   * ID of the first screen to show when session starts
   */
  entryScreenId: string;

  /**
   * All screens in the app, keyed by ID
   */
  screens: Record<string, Screen>;

  /**
   * Optional default handler for all screens (can be overridden per-screen)
   */
  defaultHandler?: ScreenHandler;

  /**
   * Optional timeout in milliseconds for the entire session
   */
  sessionTimeout?: number;

  /**
   * Optional maximum number of screens to visit in one session
   */
  maxScreens?: number;
}

/**
 * Record of one step in a session
 */
export interface SessionStep {
  /**
   * ID of the screen shown to the user
   */
  screenId: string;

  /**
   * Text displayed to the user
   */
  text: string;

  /**
   * User's input at this step (empty string if just entering the flow)
   */
  input: string;

  /**
   * Timestamp when this step occurred
   */
  timestamp: number;
}

/**
 * Complete record of a USSD session
 */
export interface Session {
  /**
   * Unique identifier for this session
   */
  sessionId: string;

  /**
   * Current state/data stored in the session
   */
  sessionData: Record<string, unknown>;

  /**
   * Ordered list of screens visited
   */
  transcript: string[];

  /**
   * Ordered list of texts shown to user
   */
  outputs: string[];

  /**
   * Ordered list of user inputs
   */
  inputs: string[];

  /**
   * All steps in detail
   */
  steps: SessionStep[];

  /**
   * ID of the current screen (or last screen if ended)
   */
  currentScreenId: string;

  /**
   * Whether the session has ended
   */
  ended: boolean;

  /**
   * Reason for ending, if applicable
   */
  endReason?: 'user' | 'invalid_input' | 'timeout' | 'max_screens' | 'handler';

  /**
   * Timestamp when session started
   */
  startTime: number;

  /**
   * Timestamp when session ended (or null if still active)
   */
  endTime: number | null;

  /**
   * Total duration in milliseconds
   */
  duration: number;

  /**
   * Any errors encountered during the session
   */
  errors: string[];
}

/**
 * Error types for USSD validation
 */
export enum USSDError {
  INVALID_ENTRY_SCREEN = 'INVALID_ENTRY_SCREEN',
  INVALID_ROUTE_TARGET = 'INVALID_ROUTE_TARGET',
  MISSING_SCREEN = 'MISSING_SCREEN',
  DUPLICATE_SCREEN = 'DUPLICATE_SCREEN',
  UNREACHABLE_SCREEN = 'UNREACHABLE_SCREEN',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE',
  INVALID_INPUT = 'INVALID_INPUT',
  SESSION_TIMEOUT = 'SESSION_TIMEOUT',
  MAX_SCREENS_EXCEEDED = 'MAX_SCREENS_EXCEEDED',
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    type: USSDError;
    message: string;
    details?: Record<string, unknown>;
  }>;
}

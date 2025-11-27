import {
  USSDApp,
  Session,
  SessionStep,
  END_SESSION,
  USSDError,
} from '../core/types';
import { AppValidator } from '../core/validator';

/**
 * Simulates USSD sessions
 */
export class Simulator {
  private app: USSDApp;
  private validator: AppValidator;

  constructor(app: USSDApp) {
    this.app = app;
    this.validator = new AppValidator();

    // Validate app on construction
    const validation = this.validator.validate(app);
    if (!validation.valid) {
      const errorMessages = validation.errors.map((e) => e.message).join(', ');
      throw new Error(`Invalid USSD app: ${errorMessages}`);
    }
  }

  /**
   * Run a simulated session with the given inputs
   */
  async run(inputs: string[]): Promise<Session> {
    const session: Session = {
      sessionId: this.generateSessionId(),
      sessionData: {},
      transcript: [],
      outputs: [],
      inputs: [],
      steps: [],
      currentScreenId: this.app.entryScreenId,
      ended: false,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      errors: [],
    };

    try {
      // Show entry screen
      await this.showScreen(session);

      // Process each input
      for (const input of inputs) {
        if (session.ended) {
          break;
        }

        // Check max screens
        if (
          this.app.maxScreens &&
          session.steps.length >= this.app.maxScreens
        ) {
          session.ended = true;
          session.endReason = 'max_screens';
          session.errors.push(
            `Session exceeded maximum of ${this.app.maxScreens} screens`
          );
          break;
        }

        // Check timeout
        if (this.app.sessionTimeout) {
          const elapsed = Date.now() - session.startTime;
          if (elapsed > this.app.sessionTimeout) {
            session.ended = true;
            session.endReason = 'timeout';
            session.errors.push(
              `Session timeout after ${this.app.sessionTimeout}ms`
            );
            break;
          }
        }

        await this.processInput(session, input);
      }

      // Check if we're on a terminal screen (no valid routes)
      const currentScreen = this.app.screens[session.currentScreenId];
      if (currentScreen && Object.keys(currentScreen.on).length === 0) {
        session.ended = true;
        session.endReason = 'user';
      }
    } catch (error) {
      session.errors.push(
        error instanceof Error ? error.message : String(error)
      );
    }

    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;

    return session;
  }

  private async showScreen(session: Session): Promise<void> {
    const screen = this.app.screens[session.currentScreenId];
    if (!screen) {
      throw new Error(`Screen "${session.currentScreenId}" not found`);
    }

    const step: SessionStep = {
      screenId: session.currentScreenId,
      text: screen.text,
      input: session.inputs.length === 0 ? '' : session.inputs[session.inputs.length - 1],
      timestamp: Date.now(),
    };

    session.transcript.push(session.currentScreenId);
    session.outputs.push(screen.text);
    session.steps.push(step);
  }

  private async processInput(session: Session, input: string): Promise<void> {
    const screen = this.app.screens[session.currentScreenId];
    if (!screen) {
      throw new Error(`Screen "${session.currentScreenId}" not found`);
    }

    session.inputs.push(input);

    // Try custom handler first
    let nextScreen: string | undefined;
    let endSession = false;

    if (screen.handler) {
      const result = await screen.handler(input, session.sessionData);
      nextScreen = result.nextScreen;
      endSession = result.endSession ?? false;
      if (result.session) {
        session.sessionData = { ...session.sessionData, ...result.session };
      }
    }

    // If no handler or handler didn't return a nextScreen, check routes
    if (!nextScreen && !endSession) {
      const target = screen.on[input];

      if (!target) {
        // Invalid input - stay on same screen or go to error screen
        session.errors.push(`Invalid input "${input}" on screen "${session.currentScreenId}"`);
        await this.showScreen(session);
        return;
      }

      if (target === END_SESSION) {
        endSession = true;
      } else {
        nextScreen = target as string;
      }
    }

    // Apply the result
    if (endSession) {
      session.ended = true;
      session.endReason = 'user';
    } else if (nextScreen) {
      session.currentScreenId = nextScreen;
      await this.showScreen(session);
    }
  }

  private generateSessionId(): string {
    // Simple session ID generation (would use uuid in real implementation)
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

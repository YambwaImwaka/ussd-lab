# API Documentation

## Core Module

### Types

#### `USSDApp`

Complete USSD application definition.

```typescript
interface USSDApp {
  entryScreenId: string;           // ID of the first screen
  screens: Record<string, Screen>; // All screens in the app
  defaultHandler?: ScreenHandler;  // Optional default handler
  sessionTimeout?: number;         // Timeout in milliseconds (default: 5 min)
  maxScreens?: number;             // Max screens per session (default: 50)
}
```

#### `Screen`

Definition of a single USSD screen.

```typescript
interface Screen {
  text: string;                    // Text displayed to user
  on: ScreenRoutes;                // Routing rules by key press
  handler?: ScreenHandler;         // Optional custom handler
}
```

#### `Session`

Complete record of a USSD session.

```typescript
interface Session {
  sessionId: string;               // Unique session ID
  sessionData: Record<string, unknown>; // User session state
  transcript: string[];            // Visited screen IDs
  outputs: string[];               // Text shown to user
  inputs: string[];                // User inputs
  steps: SessionStep[];            // Detailed step records
  currentScreenId: string;         // Current/last screen
  ended: boolean;                  // Whether session ended
  endReason?: string;              // Reason for ending
  startTime: number;               // Unix timestamp
  endTime: number | null;          // Unix timestamp or null
  duration: number;                // Total duration in ms
  errors: string[];                // Any errors encountered
}
```

#### `SessionStep`

Record of one step in a session.

```typescript
interface SessionStep {
  screenId: string;                // Screen shown
  text: string;                    // Screen text
  input: string;                   // User's input
  timestamp: number;               // Unix timestamp
}
```

### Functions

#### `createApp(config: USSDApp): USSDApp`

Factory function to create a USSD app.

```typescript
const app = createApp({
  entryScreenId: 'main_menu',
  screens: {
    main_menu: {
      text: 'Welcome\n1. Continue',
      on: { '1': 'next_screen' },
    },
    next_screen: {
      text: 'Thank you!',
      on: {},
    },
  },
});
```

#### `createScreen(config): Screen`

Factory function to create a screen.

```typescript
const screen = createScreen({
  text: 'Hello\n1. Option A\n2. Option B',
  on: {
    '1': 'screen_a',
    '2': 'screen_b',
  },
  handler: async (input, session) => {
    return { nextScreen: 'screen_a', session };
  },
});
```

#### `goToScreen(screenId, data?): HandlerResult`

Helper to navigate to a screen from a handler.

```typescript
handler: async (input, session) => {
  return goToScreen('next_screen', { customData: 'value' });
}
```

#### `endSession(data?): HandlerResult`

Helper to end a session from a handler.

```typescript
handler: async (input, session) => {
  return endSession({ finalData: 'value' });
}
```

#### `END_SESSION`

Symbol to mark a screen as the end point.

```typescript
const screen = {
  text: 'Thank you!',
  on: {
    '1': END_SESSION,
  },
};
```

---

## Simulator Module

### `Simulator`

Simulates USSD sessions.

#### Constructor

```typescript
constructor(app: USSDApp)
```

Throws an error if the app is invalid.

#### `run(inputs: string[]): Promise<Session>`

Run a simulated session with the given inputs.

```typescript
const simulator = new Simulator(app);
const session = await simulator.run(['1', '2', '0']);

console.log(session.transcript); // ['main_menu', 'screen_a', 'final']
console.log(session.outputs);    // [text1, text2, text3]
console.log(session.ended);      // true/false
```

**Parameters:**
- `inputs`: Array of user inputs (key presses)

**Returns:** A `Session` object with the complete transcript and results.

---

## Testing Module

### Assertions

#### `assertScreen(session, expectedScreenId): void`

Assert that the session is currently on a specific screen.

```typescript
assertScreen(session, 'main_menu');
```

#### `assertEnded(session): void`

Assert that the session has ended.

```typescript
assertEnded(session);
```

#### `assertNotEnded(session): void`

Assert that the session is still active.

```typescript
assertNotEnded(session);
```

#### `assertOutputContains(session, text): void`

Assert that the last output contains specific text.

```typescript
assertOutputContains(session, 'Balance');
```

#### `assertAnyOutputContains(session, text): void`

Assert that any output contains specific text.

```typescript
assertAnyOutputContains(session, 'Thank you');
```

#### `assertScreenVisited(session, screenId): void`

Assert that a specific screen was visited.

```typescript
assertScreenVisited(session, 'confirm_screen');
```

#### `assertScreenNotVisited(session, screenId): void`

Assert that a specific screen was NOT visited.

```typescript
assertScreenNotVisited(session, 'error_screen');
```

#### `assertStepCount(session, count): void`

Assert the number of steps in the session.

```typescript
assertStepCount(session, 5);
```

#### `assertNoErrors(session): void`

Assert that the session has no errors.

```typescript
assertNoErrors(session);
```

#### `assertHasError(session, errorMessage): void`

Assert that the session has a specific error.

```typescript
assertHasError(session, 'Invalid input');
```

### Helper Functions

#### `lastOutput(session): string`

Get the last output text.

```typescript
const text = lastOutput(session);
console.log(text);
```

#### `screenPath(session): string`

Get the screen path as a string (for debugging).

```typescript
const path = screenPath(session);
console.log(path); // 'main_menu -> screen_a -> confirm'
```

#### `createTestApp(screens): USSDApp`

Helper to quickly create a test app.

```typescript
const app = createTestApp({
  main_menu: {
    text: 'Welcome\n1. Continue',
    routes: { '1': 'next' },
  },
  next: {
    text: 'Done',
    routes: { '0': 'END' },
  },
});
```

---

## Handler Functions

### Custom Screen Handlers

You can add custom logic to screens using handler functions:

```typescript
handler: async (input: string, session: Record<string, unknown>) => {
  // Custom logic here
  return {
    nextScreen?: 'screen_id',    // Where to go next
    endSession?: boolean,         // Whether to end
    session?: { ...sessionData }, // Updated session data
  };
}
```

**Example with Validation:**

```typescript
enter_amount: {
  text: 'Enter amount:',
  on: { '0': 'cancel' },
  handler: async (input, session) => {
    const amount = parseInt(input);
    
    if (isNaN(amount) || amount <= 0) {
      return { nextScreen: 'enter_amount', session };
    }
    
    if (amount > 10000) {
      return { nextScreen: 'amount_too_high', session };
    }
    
    return {
      nextScreen: 'confirm',
      session: { ...session, amount },
    };
  },
}
```

---

## Common Patterns

### Input Validation

```typescript
handler: async (input, session) => {
  // Phone number validation
  if (!/^\d{10}$/.test(input)) {
    return { nextScreen: 'invalid_phone', session };
  }
  
  return {
    nextScreen: 'next_step',
    session: { ...session, phone: input },
  };
}
```

### Session State Management

```typescript
// Store data during flow
handler: async (input, session) => {
  return {
    nextScreen: 'confirmation',
    session: {
      ...session,
      amount: 100,
      recipient: '555-1234',
      timestamp: Date.now(),
    },
  };
}

// Access data later
another_handler: async (input, session) => {
  const { amount, recipient } = session;
  // Use stored data
}
```

### Conditional Navigation

```typescript
handler: async (input, session) => {
  const isVIP = session.userType === 'vip';
  
  return {
    nextScreen: isVIP ? 'vip_options' : 'standard_options',
    session,
  };
}
```

### Dynamic Text

```typescript
// Store text in session and display it on next screen
handler: async (input, session) => {
  const balance = await getBalance(input); // e.g., API call
  
  return {
    nextScreen: 'show_balance',
    session: {
      ...session,
      balanceText: `Your balance: K${balance}`,
    },
  };
}
```

---

## Error Handling

### Validation Errors

```typescript
try {
  const simulator = new Simulator(invalidApp);
} catch (error) {
  console.error('Invalid app:', error.message);
}
```

### Session Errors

```typescript
const session = await simulator.run(inputs);

if (session.errors.length > 0) {
  console.log('Errors during session:', session.errors);
}
```

### Invalid Input Handling

Invalid inputs stay on the current screen and are logged:

```typescript
const session = await sim.run(['1', '9', '2']);
// If '9' is not a valid option on the current screen,
// the simulator stays on that screen and logs an error.
```

---

## Configuration Options

### Session Timeout

```typescript
const app = createApp({
  entryScreenId: 'main',
  screens: { /* ... */ },
  sessionTimeout: 10 * 60 * 1000, // 10 minutes
});
```

### Maximum Screens

```typescript
const app = createApp({
  entryScreenId: 'main',
  screens: { /* ... */ },
  maxScreens: 100, // Prevent infinite loops
});
```

---

For more examples, see [EXAMPLES.md](./EXAMPLES.md).

# Quick Reference Guide

## Core Concepts at a Glance

### Screen
```typescript
{
  text: 'Display text\n1. Option 1\n2. Option 2',
  on: { '1': 'next_screen_id', '2': 'other_screen' },
  handler?: async (input, session) => ({ nextScreen?, session?, endSession? })
}
```

### App
```typescript
createApp({
  entryScreenId: 'main',
  screens: { /* ... */ },
  sessionTimeout: 5 * 60 * 1000, // optional
  maxScreens: 50,                // optional
})
```

### Session Flow
```typescript
const sim = new Simulator(app);
const session = await sim.run(['1', '2', '0']);

// Result contains:
- transcript: string[]       // Screen IDs visited
- outputs: string[]         // Text shown
- inputs: string[]          // User inputs
- sessionData: object       // Stored data
- ended: boolean           // Is session done?
- errors: string[]         // Any errors
```

## Common Patterns

### Simple Routing
```typescript
{
  text: 'Choose:\n1. A\n2. B',
  on: { '1': 'screen_a', '2': 'screen_b' }
}
```

### Input Validation
```typescript
handler: async (input, session) => {
  if (!/^\d{10}$/.test(input)) {
    return { nextScreen: 'same_screen', session };
  }
  return { nextScreen: 'next_screen', session };
}
```

### Store Data
```typescript
handler: async (input, session) => ({
  nextScreen: 'next',
  session: { ...session, amount: 100 }
})
```

### End Session
```typescript
handler: async (input, session) => ({
  endSession: true,
  session
})
```

### Conditional Logic
```typescript
handler: async (input, session) => ({
  nextScreen: session.isVIP ? 'vip_menu' : 'regular_menu',
  session
})
```

## Testing

### Basic Test
```typescript
const sim = new Simulator(app);
const session = await sim.run(['1', '0']);

assertScreen(session, 'expected_screen');
assertOutputContains(session, 'text');
assertNoErrors(session);
```

### Assertions
```typescript
assertScreen(session, 'screen_id')
assertEnded(session) / assertNotEnded(session)
assertOutputContains(session, 'text')
assertScreenVisited(session, 'screen_id')
assertStepCount(session, 5)
assertNoErrors(session)
assertHasError(session, 'error message')
```

## API Quick Reference

### Create
- `createApp(config)` - Create app
- `createScreen(config)` - Create screen
- `createTestApp(screens)` - Test app

### Simulate
- `new Simulator(app)` - Create simulator
- `simulator.run(inputs)` - Run session

### Assert
- `assertScreen(session, id)`
- `assertEnded(session)`
- `assertOutputContains(session, text)`
- `assertScreenVisited(session, id)`
- `assertNoErrors(session)`

### Helpers
- `goToScreen(screenId, data)`
- `endSession(data)`
- `lastOutput(session)` - Get last text
- `screenPath(session)` - Get path string

### Special
- `END_SESSION` - Symbol to end

## Session Object Structure

```typescript
{
  sessionId: string                    // Unique ID
  sessionData: Record<string, any>     // Stored state
  transcript: string[]                 // Screen IDs
  outputs: string[]                    // Texts shown
  inputs: string[]                     // User inputs
  steps: SessionStep[]                 // Detailed steps
  currentScreenId: string              // Current screen
  ended: boolean                       // Is done?
  endReason?: string                   // Why ended
  startTime: number                    // Timestamp
  endTime: number | null              // Timestamp
  duration: number                     // Milliseconds
  errors: string[]                     // Error messages
}
```

## Common File Locations

```
docs/GETTING_STARTED.md  - Tutorial
docs/API.md              - Full API docs
EXAMPLES.md              - Real-world examples
src/core/types.ts        - All interfaces
src/simulator/simulator.ts - Simulator logic
src/testing/assertions.ts - Test helpers
```

## Type Exports

```typescript
import {
  // Types
  USSDApp, Screen, Session, SessionStep,
  HandlerResult, ScreenHandler, ScreenRoutes,
  
  // Enums
  USSDError,
  
  // Validation
  AppValidator, ValidationResult,
  
  // Builders
  createApp, createScreen, goToScreen, endSession,
  END_SESSION,
  
  // Simulator
  Simulator,
  
  // Testing
  assertScreen, assertEnded, assertOutputContains,
  assertScreenVisited, assertNoErrors, assertHasError,
  lastOutput, screenPath,
  createTestApp,
} from '@yambwa/ussd-lab';
```

## Development Commands

```bash
npm install          # Install deps
npm run dev         # Watch compile
npm run build       # Build prod
npm test            # Run tests
npm run lint        # Check code
npm run format      # Auto-format
npm run type-check  # Type check
```

## Handler Return Values

```typescript
// Go to screen
{ nextScreen: 'screen_id' }

// End session
{ endSession: true }

// Stay on same screen
{ nextScreen: session.currentScreenId }

// With data
{ nextScreen: 'screen_id', session: { ...data } }

// Invalid input (stay)
{ nextScreen: session.currentScreenId, session }
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Invalid entry screen | Entry screen ID doesn't exist | Check screen IDs |
| Invalid route target | Route points to non-existent screen | Create missing screen |
| Unreachable screen | Screen not linked from entry | Add route to it |
| Invalid input | User pressed invalid key | Check `on` routes |

## Tips

1. ✅ Start with simple flows, add complexity gradually
2. ✅ Write tests as you build
3. ✅ Use meaningful screen IDs
4. ✅ Store what you need in sessionData
5. ✅ Test all paths (happy path + error cases)
6. ✅ Use handlers for validation
7. ✅ End sessions cleanly
8. ✅ Document complex flows

## Resources

- **Getting Started**: [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)
- **Full API**: [docs/API.md](./docs/API.md)
- **Examples**: [EXAMPLES.md](./EXAMPLES.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Roadmap**: [ROADMAP.md](./ROADMAP.md)

---

For detailed documentation, see the docs folder. For examples, see EXAMPLES.md.

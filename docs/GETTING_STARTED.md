# Getting Started with @yambwa/ussd-lab

This guide will help you get started building and testing USSD flows with @yambwa/ussd-lab.

## Installation

```bash
npm install @yambwa/ussd-lab
```

## 5-Minute Quickstart

### 1. Define Your First USSD App

Create a file `my-app.ts`:

```typescript
import { createApp } from '@yambwa/ussd-lab';

export const myApp = createApp({
  entryScreenId: 'welcome',
  screens: {
    welcome: {
      text: 'Welcome!\n1. Check Balance\n2. Exit',
      on: {
        '1': 'balance',
        '2': 'goodbye',
      },
    },
    balance: {
      text: 'Your balance is $100\n0. Back',
      on: {
        '0': 'welcome',
      },
    },
    goodbye: {
      text: 'Thank you!',
      on: {},
    },
  },
});
```

### 2. Simulate a Session

Create a file `simulate.ts`:

```typescript
import { Simulator } from '@yambwa/ussd-lab';
import { myApp } from './my-app';

async function run() {
  const simulator = new Simulator(myApp);
  
  // Simulate: user presses 1, then 0
  const session = await simulator.run(['1', '0']);
  
  console.log('Screens visited:', session.transcript);
  // Output: ['welcome', 'balance', 'welcome']
  
  console.log('Final screen:', session.currentScreenId);
  // Output: 'welcome'
}

run();
```

### 3. Test It

Create a file `my-app.test.ts`:

```typescript
import { describe, it } from 'vitest';
import {
  Simulator,
  assertScreen,
  assertOutputContains,
} from '@yambwa/ussd-lab';
import { myApp } from './my-app';

describe('My USSD App', () => {
  it('should show balance', async () => {
    const sim = new Simulator(myApp);
    const session = await sim.run(['1']);
    
    assertScreen(session, 'balance');
    assertOutputContains(session, '$100');
  });
  
  it('should return to welcome', async () => {
    const sim = new Simulator(myApp);
    const session = await sim.run(['1', '0']);
    
    assertScreen(session, 'welcome');
  });
});
```

Run tests:

```bash
npm test
```

## Key Concepts

### Screens

A screen is what the user sees at each step:

```typescript
{
  text: 'What would you like to do?\n1. Option A\n2. Option B',
  on: {
    '1': 'screen_a',
    '2': 'screen_b',
  },
}
```

- **text**: What the user sees
- **on**: How keypresses route to other screens

### Sessions

A session is one complete interaction:

```typescript
const session = await simulator.run(['1', '2', '0']);

// session.transcript contains the screens visited
// session.outputs contains the text shown
// session.inputs contains the user's keypresses
// session.sessionData contains any stored state
```

### Handlers

Custom logic on a screen:

```typescript
{
  text: 'Enter amount:',
  on: { '0': 'cancel' },
  handler: async (input, session) => {
    const amount = parseInt(input);
    
    if (amount < 0) {
      return { nextScreen: 'enter_amount', session };
    }
    
    return {
      nextScreen: 'confirm',
      session: { ...session, amount },
    };
  },
}
```

- Handlers run before routing
- They can validate input
- They can store data
- They can redirect to different screens

## Common Tasks

### Validate User Input

```typescript
{
  text: 'Enter phone number (10 digits):',
  on: { '0': 'cancel' },
  handler: async (input, session) => {
    if (!/^\d{10}$/.test(input)) {
      // Stay on same screen
      return { nextScreen: 'enter_phone', session };
    }
    
    return {
      nextScreen: 'confirm',
      session: { ...session, phone: input },
    };
  },
}
```

### Store Session Data

```typescript
handler: async (input, session) => {
  return {
    nextScreen: 'next_screen',
    session: {
      ...session,
      userId: input,
      timestamp: Date.now(),
      action: 'login',
    },
  };
}
```

### Conditional Routing

```typescript
handler: async (input, session) => {
  const isAdult = session.age >= 18;
  
  return {
    nextScreen: isAdult ? 'adult_options' : 'restricted',
    session,
  };
}
```

### End Session Early

```typescript
handler: async (input, session) => {
  if (input === '*') {
    return { endSession: true, session };
  }
  
  return { nextScreen: 'next_screen', session };
}
```

## Testing Patterns

### Test Happy Path

```typescript
it('should complete flow successfully', async () => {
  const sim = new Simulator(app);
  const session = await sim.run(['1', '123456', '1']);
  
  assertScreen(session, 'success');
  assertNoErrors(session);
});
```

### Test Error Cases

```typescript
it('should reject invalid input', async () => {
  const sim = new Simulator(app);
  const session = await sim.run(['1', 'invalid', '1']);
  
  assertHasError(session, 'Invalid');
});
```

### Test All Paths

```typescript
it('should support cancellation', async () => {
  const sim = new Simulator(app);
  const session = await sim.run(['1', '0']); // 0 = cancel
  
  assertScreen(session, 'main_menu');
});
```

## Next Steps

- Read the [API documentation](./docs/API.md)
- Check out [examples](./EXAMPLES.md)
- Build your own USSD app!
- Write tests for your flows
- Deploy to a test environment

## Debugging

### View Session Transcript

```typescript
const session = await sim.run(['1', '2', '0']);

console.log('Path:', session.transcript.join(' -> '));
// Output: main_menu -> option1 -> option2 -> main_menu

console.log('Outputs:', session.outputs);
console.log('Inputs:', session.inputs);
console.log('Errors:', session.errors);
console.log('Data:', session.sessionData);
```

### Trace Step by Step

```typescript
const session = await sim.run(['1', '2']);

session.steps.forEach((step, i) => {
  console.log(`Step ${i + 1}: ${step.screenId}`);
  console.log(`  Text: ${step.text.substring(0, 50)}...`);
  console.log(`  Input: ${step.input}`);
});
```

## Tips & Tricks

1. **Start simple** - Define screens and routing first
2. **Add handlers later** - Add custom logic after the basic flow works
3. **Test often** - Write tests as you build
4. **Use meaningful IDs** - Make screen IDs descriptive
5. **Comment complex logic** - Help your future self
6. **Store what you need** - Use sessionData to pass info forward

## Troubleshooting

### "Invalid USSD app" Error

Check that:
- All screens referenced in `on` routes actually exist
- The entry screen ID is correct
- Screen routes only reference valid targets

### "Session exceeded maximum"

Increase the limit:

```typescript
createApp({
  entryScreenId: 'main',
  screens: { /* ... */ },
  maxScreens: 100, // default is 50
})
```

### Tests Not Running

Ensure:
- Files end with `.test.ts` or `.spec.ts`
- You have vitest installed: `npm install -D vitest`
- Run `npm test`

## Getting Help

- Check [examples](./EXAMPLES.md)
- Read [API docs](./docs/API.md)
- Open an [issue](https://github.com/YambwaImwaka/pretty-lodger/issues)
- Read the [contributing guide](./CONTRIBUTING.md)

Happy coding! 🎉

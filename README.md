# @yambwa/ussd-lab

A USSD flow simulator and testing lab for developers – design, run, and debug USSD menus without connecting to a mobile network.

## Overview

USSD is widely used across Africa for mobile money, banking, utilities, and government services. However, developers face challenges:

- Dependence on slow, limited, or unstable aggregator sandboxes
- Repetitive manual testing (dial → press keys → repeat)
- Difficulty visualizing the full menu tree and testing edge cases
- Lack of standard devtools for USSD flows (like Postman for APIs)

**@yambwa/ussd-lab** is the missing devtool for USSD. Before you deploy to a telco or aggregator, debug and test it locally.

## Features

### 1. Define USSD Flows in Code

Describe your USSD menu as a set of screens with logic:

```typescript
const bankMenu = createApp({
  entryScreenId: 'main_menu',
  screens: {
    main_menu: {
      text: 'Welcome to MyBank\n1. Balance\n2. Transfer\n0. Exit',
      on: {
        '1': 'check_balance',
        '2': 'transfer_menu',
        '0': END_SESSION,
      },
    },
    check_balance: {
      text: 'Your balance is $100\n0. Back',
      on: {
        '0': 'main_menu',
      },
    },
    transfer_menu: {
      text: 'Enter recipient phone:\n(or press 0 to cancel)',
      on: {
        '0': 'main_menu',
      },
      handler: async (input) => {
        // Custom logic to validate phone and move to next screen
        return { nextScreen: 'transfer_confirm', session: {} };
      },
    },
  },
});
```

### 2. Simulate Full USSD Sessions

Run a session with a sequence of inputs and inspect the results:

```typescript
const simulator = new Simulator(bankMenu);
const session = await simulator.run(['1', '0']); // User presses 1, then 0

console.log(session.transcript); // [main_menu, check_balance, main_menu]
console.log(session.outputs); // ["Welcome to MyBank...", "Your balance is..."]
console.log(session.ended); // false (user can still interact)
```

### 3. Testing Support

Write automated tests for your USSD flows:

```typescript
import { describe, it, expect } from 'vitest';
import { Simulator } from '@yambwa/ussd-lab/simulator';
import { assertScreen, assertEnded } from '@yambwa/ussd-lab/testing';

describe('Bank Menu', () => {
  it('should show balance when user presses 1', async () => {
    const sim = new Simulator(bankMenu);
    const session = await sim.run(['1']);
    
    assertScreen(session, 'check_balance');
    expect(session.outputs[1]).toContain('Your balance');
  });

  it('should return to main menu when pressing 0', async () => {
    const sim = new Simulator(bankMenu);
    const session = await sim.run(['1', '0']);
    
    assertScreen(session, 'main_menu');
  });

  it('should end session when exiting', async () => {
    const sim = new Simulator(bankMenu);
    const session = await sim.run(['0']);
    
    assertEnded(session);
  });
});
```

## Target Users

- **Backend developers** building USSD apps for banks, mobile money, NGOs, government
- **Fintech engineers** handling payment flows, balance checks, utility payments
- **Integrators & aggregators** needing a way to test flows internally
- **QA engineers** wanting repeatable, automated USSD testing

## Project Structure

```
src/
├── core/              # Types, validation, USSD app definition
├── simulator/         # Session simulation engine
├── testing/           # Jest/Vitest test helpers
└── playground/        # (Future) React web UI for flow testing
```

## Installation

```bash
npm install @yambwa/ussd-lab
```

## Quick Start

```typescript
import { createApp, Simulator } from '@yambwa/ussd-lab';

const app = createApp({
  entryScreenId: 'welcome',
  screens: {
    welcome: {
      text: 'Hello!\n1. Continue',
      on: { '1': 'end' },
    },
    end: {
      text: 'Goodbye!',
      on: {},
    },
  },
});

const sim = new Simulator(app);
const session = await sim.run(['1']);
console.log(session); // Full transcript of the session
```

## Roadmap

- [ ] Visual flow editor (drag-and-drop USSD flows)
- [ ] Export flows to aggregator-specific formats
- [ ] Analytics on simulated sessions (user dropoff points)
- [ ] Multi-language USSD support
- [ ] Integration examples with real USSD providers
- [ ] React playground component

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

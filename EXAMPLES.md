# Examples

## Example 1: Simple Banking Menu

```typescript
import { createApp, Simulator } from '@yambwa/ussd-lab';

const bankMenu = createApp({
  entryScreenId: 'main_menu',
  screens: {
    main_menu: {
      text: 'Welcome to MyBank\n1. Check Balance\n2. Transfer Money\n0. Exit',
      on: {
        '1': 'balance',
        '2': 'transfer',
        '0': 'goodbye',
      },
    },
    balance: {
      text: 'Your balance is ZMW 5,000\n0. Back to Main Menu',
      on: {
        '0': 'main_menu',
      },
    },
    transfer: {
      text: 'Enter recipient account number:\n(10 digits or 0 to cancel)',
      on: {
        '0': 'main_menu',
      },
    },
    goodbye: {
      text: 'Thank you for using MyBank. Goodbye!',
      on: {},
    },
  },
});

async function demo() {
  const sim = new Simulator(bankMenu);
  
  // Simulate user checking balance
  const session = await sim.run(['1', '0']);
  
  console.log('Screens visited:', session.transcript);
  // Output: ['main_menu', 'balance', 'main_menu']
  
  console.log('Final screen:', session.currentScreenId);
  // Output: 'main_menu'
}

demo();
```

## Example 2: Mobile Money with Validation

```typescript
import { createApp, Simulator, goToScreen } from '@yambwa/ussd-lab';

const mobileMoneyApp = createApp({
  entryScreenId: 'welcome',
  screens: {
    welcome: {
      text: 'Welcome to QuickPay\n1. Send Money\n2. Receive Money\n0. Exit',
      on: {
        '1': 'enter_amount',
        '2': 'payment_codes',
        '0': 'end',
      },
    },
    enter_amount: {
      text: 'Enter amount (ZMW):\n(or 0 to cancel)',
      on: {
        '0': 'welcome',
      },
      handler: async (input, session) => {
        const amount = parseInt(input);
        
        if (isNaN(amount) || amount <= 0) {
          return { nextScreen: 'enter_amount', session };
        }
        
        if (amount > 10000) {
          // Could show error screen
          return { nextScreen: 'amount_too_high', session };
        }
        
        return {
          nextScreen: 'confirm_amount',
          session: { ...session, amount },
        };
      },
    },
    confirm_amount: {
      text: 'Confirm send ZMW [amount]?\n1. Yes\n0. No',
      on: {
        '1': 'success',
        '0': 'welcome',
      },
    },
    success: {
      text: 'Money sent successfully!',
      on: {},
    },
    payment_codes: {
      text: 'Payment Codes:\n1. Display Code\n0. Back',
      on: {
        '1': 'show_code',
        '0': 'welcome',
      },
    },
    show_code: {
      text: 'Your code: ABC123XYZ\n0. Back',
      on: {
        '0': 'welcome',
      },
    },
    end: {
      text: 'Thank you!',
      on: {},
    },
  },
});

async function testFlow() {
  const sim = new Simulator(mobileMoneyApp);
  
  // Test sending money
  const session = await sim.run(['1', '500', '1']);
  
  console.log('Session transcript:', session.transcript);
  console.log('Session data:', session.sessionData);
}

testFlow();
```

## Example 3: Testing with Vitest

```typescript
import { describe, it, expect } from 'vitest';
import {
  createApp,
  Simulator,
  assertScreen,
  assertOutputContains,
  assertEnded,
} from '@yambwa/ussd-lab';

describe('Airtime Purchase Flow', () => {
  const airtimeApp = createApp({
    entryScreenId: 'menu',
    screens: {
      menu: {
        text: 'Buy Airtime\n1. Zambia\n2. Kenya\n0. Exit',
        on: {
          '1': 'amount_zm',
          '2': 'amount_ke',
          '0': 'goodbye',
        },
      },
      amount_zm: {
        text: 'Enter amount (K):\n1. K5\n2. K10\n3. K20',
        on: {
          '1': 'confirm_zm',
          '2': 'confirm_zm',
          '3': 'confirm_zm',
        },
      },
      confirm_zm: {
        text: 'Confirm purchase?\n1. Yes\n0. No',
        on: {
          '1': 'success',
          '0': 'menu',
        },
      },
      amount_ke: {
        text: 'Enter amount (K):\n1. 50\n2. 100\n3. 200',
        on: {
          '1': 'confirm_ke',
          '2': 'confirm_ke',
          '3': 'confirm_ke',
        },
      },
      confirm_ke: {
        text: 'Confirm purchase?\n1. Yes\n0. No',
        on: {
          '1': 'success',
          '0': 'menu',
        },
      },
      success: {
        text: 'Airtime purchased successfully!',
        on: {},
      },
      goodbye: {
        text: 'Goodbye!',
        on: {},
      },
    },
  });

  it('should allow buying Zambian airtime', async () => {
    const sim = new Simulator(airtimeApp);
    const session = await sim.run(['1', '2', '1']);

    assertScreen(session, 'success');
    assertOutputContains(session, 'successfully');
  });

  it('should allow user to cancel and return to menu', async () => {
    const sim = new Simulator(airtimeApp);
    const session = await sim.run(['1', '2', '0']);

    assertScreen(session, 'menu');
  });

  it('should support both Zambia and Kenya', async () => {
    const sim = new Simulator(airtimeApp);
    const zm_session = await sim.run(['1', '1', '1']);
    const ke_session = await sim.run(['2', '2', '1']);

    assertScreen(zm_session, 'success');
    assertScreen(ke_session, 'success');
  });

  it('should end session properly', async () => {
    const sim = new Simulator(airtimeApp);
    const session = await sim.run(['0']);

    assertEnded(session);
    assertScreen(session, 'goodbye');
  });
});
```

## Example 4: Government Service (Electricity Token)

```typescript
import { createApp, Simulator, endSession } from '@yambwa/ussd-lab';

const zescoApp = createApp({
  entryScreenId: 'language',
  screens: {
    language: {
      text: 'Select Language\n1. English\n2. Bemba\n3. Nyanja',
      on: {
        '1': 'main_menu',
        '2': 'main_menu',
        '3': 'main_menu',
      },
    },
    main_menu: {
      text: 'ZESCO Token Services\n1. Buy Token\n2. Account Info\n0. Exit',
      on: {
        '1': 'account_number',
        '2': 'account_info',
        '0': 'exit',
      },
    },
    account_number: {
      text: 'Enter your account number\n(13 digits)',
      on: {
        '0': 'main_menu',
      },
      handler: async (input, session) => {
        if (input.length !== 13 || !/^\d+$/.test(input)) {
          return { nextScreen: 'invalid_account', session };
        }

        return {
          nextScreen: 'select_amount',
          session: { ...session, account: input },
        };
      },
    },
    select_amount: {
      text: 'Select Amount:\n1. K50\n2. K100\n3. K200\n4. Other',
      on: {
        '1': 'confirm',
        '2': 'confirm',
        '3': 'confirm',
        '4': 'enter_amount',
      },
    },
    enter_amount: {
      text: 'Enter amount (K):',
      on: {
        '0': 'select_amount',
      },
      handler: async (input, session) => {
        const amount = parseInt(input);
        if (isNaN(amount) || amount < 10) {
          return { nextScreen: 'enter_amount', session };
        }
        return {
          nextScreen: 'confirm',
          session: { ...session, amount },
        };
      },
    },
    confirm: {
      text: 'Confirm purchase?\n1. Yes\n0. No',
      on: {
        '1': 'processing',
        '0': 'main_menu',
      },
    },
    processing: {
      text: 'Processing your request...\nPlease wait.',
      on: {
        '': 'success', // Auto-advance after processing
      },
    },
    success: {
      text: 'Token sent to your phone.\nKeep this code safe.',
      on: {
        '0': 'main_menu',
      },
    },
    account_info: {
      text: 'Account Balance: K5,432\nLast Payment: 2025-11-20\n0. Back',
      on: {
        '0': 'main_menu',
      },
    },
    invalid_account: {
      text: 'Invalid account number.\n0. Try again\n1. Back to Menu',
      on: {
        '0': 'account_number',
        '1': 'main_menu',
      },
    },
    exit: {
      text: 'Thank you for using ZESCO.\nGoodbye!',
      on: {},
    },
  },
});

async function demo() {
  const sim = new Simulator(zescoApp);

  // Successful token purchase
  const session = await sim.run([
    '1', // English
    '1', // Buy Token
    '1234567890123', // Account number
    '2', // K100
    '1', // Confirm
  ]);

  console.log('Transcript:', session.transcript);
  console.log('Final screen:', session.currentScreenId);
  console.log('Session ended:', session.ended);
}

demo();
```

## Example 5: NGO Feedback Collection

```typescript
import { createApp, Simulator } from '@yambwa/ussd-lab';

const feedbackApp = createApp({
  entryScreenId: 'welcome',
  screens: {
    welcome: {
      text: 'Welcome to Health Survey\nHelp us improve our services\n1. Continue\n0. Exit',
      on: {
        '1': 'q1_age',
        '0': 'exit',
      },
    },
    q1_age: {
      text: 'What is your age group?\n1. 13-24\n2. 25-34\n3. 35+',
      on: {
        '1': 'q2_service',
        '2': 'q2_service',
        '3': 'q2_service',
      },
      handler: async (input, session) => {
        const ageGroups: Record<string, string> = {
          '1': '13-24',
          '2': '25-34',
          '3': '35+',
        };
        return {
          nextScreen: 'q2_service',
          session: { ...session, ageGroup: ageGroups[input] },
        };
      },
    },
    q2_service: {
      text: 'How satisfied are you?\n1. Very\n2. Somewhat\n3. Not satisfied',
      on: {
        '1': 'q3_recommend',
        '2': 'q3_recommend',
        '3': 'q3_recommend',
      },
      handler: async (input, session) => {
        const satisfaction: Record<string, string> = {
          '1': 'Very Satisfied',
          '2': 'Somewhat Satisfied',
          '3': 'Not Satisfied',
        };
        return {
          nextScreen: 'q3_recommend',
          session: { ...session, satisfaction: satisfaction[input] },
        };
      },
    },
    q3_recommend: {
      text: 'Would you recommend us?\n1. Yes\n2. No\n3. Not sure',
      on: {
        '1': 'thanks',
        '2': 'thanks',
        '3': 'thanks',
      },
      handler: async (input, session) => {
        const recommend: Record<string, string> = {
          '1': 'Yes',
          '2': 'No',
          '3': 'Not Sure',
        };
        return {
          nextScreen: 'thanks',
          session: { ...session, recommend: recommend[input] },
        };
      },
    },
    thanks: {
      text: 'Thank you for your feedback!\nIt helps us improve.',
      on: {
        '0': 'exit',
      },
    },
    exit: {
      text: 'Goodbye!',
      on: {},
    },
  },
});

async function collectFeedback() {
  const sim = new Simulator(feedbackApp);

  // Simulate survey completion
  const session = await sim.run(['1', '2', '2', '1']);

  console.log('Collected feedback:', session.sessionData);
  // Output: {
  //   ageGroup: '25-34',
  //   satisfaction: 'Somewhat Satisfied',
  //   recommend: 'Yes'
  // }
}

collectFeedback();
```

These examples demonstrate:
- Simple sequential menus
- Custom handlers for validation
- Session data storage
- Testing patterns
- Real-world use cases (banking, mobile money, government, NGO)

For more information, see the [main README](./README.md) and [API documentation](./docs/API.md).

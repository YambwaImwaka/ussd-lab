import { describe, it, expect } from 'vitest';
import { createApp, Simulator, assertScreen, assertEnded, assertOutputContains } from '../index';

describe('USSD Simulator', () => {
  const testApp = createApp({
    entryScreenId: 'main_menu',
    screens: {
      main_menu: {
        text: 'Welcome to MyBank\n1. Balance\n2. Transfer\n0. Exit',
        on: {
          '1': 'check_balance',
          '2': 'transfer_menu',
          '0': 'end',
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
      },
      end: {
        text: 'Thank you for using MyBank!',
        on: {},
      },
    },
  });

  it('should start at entry screen', async () => {
    const sim = new Simulator(testApp);
    const session = await sim.run([]);

    assertScreen(session, 'main_menu');
    assertOutputContains(session, 'Welcome to MyBank');
  });

  it('should navigate to balance screen', async () => {
    const sim = new Simulator(testApp);
    const session = await sim.run(['1']);

    assertScreen(session, 'check_balance');
    assertOutputContains(session, 'Your balance');
  });

  it('should return to main menu', async () => {
    const sim = new Simulator(testApp);
    const session = await sim.run(['1', '0']);

    assertScreen(session, 'main_menu');
  });

  it('should end session when exiting', async () => {
    const sim = new Simulator(testApp);
    const session = await sim.run(['0']);

    assertEnded(session);
    assertScreen(session, 'end');
  });

  it('should handle invalid input gracefully', async () => {
    const sim = new Simulator(testApp);
    const session = await sim.run(['9']);

    expect(session.errors.length).toBeGreaterThan(0);
  });

  it('should track complete transcript', async () => {
    const sim = new Simulator(testApp);
    const session = await sim.run(['1', '0', '2']);

    expect(session.transcript).toEqual([
      'main_menu',
      'check_balance',
      'main_menu',
      'transfer_menu',
    ]);
  });

  it('should record all outputs', async () => {
    const sim = new Simulator(testApp);
    const session = await sim.run(['1', '0']);

    expect(session.outputs.length).toBe(3); // main_menu, check_balance, main_menu
    expect(session.outputs[0]).toContain('Welcome');
    expect(session.outputs[1]).toContain('balance');
  });
});

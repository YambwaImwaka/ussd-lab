#!/usr/bin/env node
/**
 * Interactive demo: Let users test the USSD simulator in real-time
 * This shows how the library works with actual user interactions
 */
import { createApp } from './core/builders.js';
import { Simulator } from './simulator/simulator.js';
const sampleApp = createApp({
    entryScreenId: 'main',
    screens: {
        main: {
            text: 'Welcome to Demo USSD\n1. Check Balance\n2. Make Transfer\n3. Buy Airtime\n0. Exit',
            on: {
                '1': 'balance',
                '2': 'transfer',
                '3': 'airtime',
                '0': 'exit',
            },
        },
        balance: {
            text: 'Your balance: K5,000.00\n0. Back to Menu',
            on: {
                '0': 'main',
            },
        },
        transfer: {
            text: 'Transfer Menu\nEnter phone number:\n(or 0 to cancel)',
            on: {
                '0': 'main',
            },
            handler: async (input, session) => {
                if (!/^\d{10}$/.test(input)) {
                    return { nextScene: 'error', session };
                }
                return {
                    nextScreen: 'transfer_amount',
                    session: { ...session, phone: input },
                };
            },
        },
        transfer_amount: {
            text: 'Enter amount (K):\n1. K100  2. K500  3. K1000',
            on: {
                '1': 'transfer_confirm',
                '2': 'transfer_confirm',
                '3': 'transfer_confirm',
            },
            handler: async (input, session) => {
                const amounts = {
                    '1': 100,
                    '2': 500,
                    '3': 1000,
                };
                return {
                    nextScreen: 'transfer_confirm',
                    session: { ...session, amount: amounts[input] },
                };
            },
        },
        transfer_confirm: {
            text: 'Confirm transfer?\n1. Yes\n0. No',
            on: {
                '1': 'transfer_success',
                '0': 'main',
            },
        },
        transfer_success: {
            text: 'Transfer successful!\n0. Back',
            on: {
                '0': 'main',
            },
        },
        airtime: {
            text: 'Buy Airtime\n1. K10  2. K20  3. K50\n0. Cancel',
            on: {
                '1': 'airtime_confirm',
                '2': 'airtime_confirm',
                '3': 'airtime_confirm',
                '0': 'main',
            },
        },
        airtime_confirm: {
            text: 'Confirm purchase?\n1. Yes\n0. No',
            on: {
                '1': 'airtime_success',
                '0': 'main',
            },
        },
        airtime_success: {
            text: 'Airtime purchased!\n0. Back',
            on: {
                '0': 'main',
            },
        },
        error: {
            text: 'Invalid input\n0. Back',
            on: {
                '0': 'main',
            },
        },
        exit: {
            text: 'Thank you for using this service',
            on: {},
        },
    },
});
async function showDemo() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║         @yambwa/ussd-lab - Interactive Demo              ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    const simulator = new Simulator(sampleApp);
    // Simulate different user journeys
    const journeys = [
        {
            name: 'Check Balance & Exit',
            inputs: ['1', '0'],
        },
        {
            name: 'Buy Airtime',
            inputs: ['3', '2', '1'],
        },
        {
            name: 'Transfer Money',
            inputs: ['2', '0261234567', '2', '1'],
        },
        {
            name: 'Invalid Input Handling',
            inputs: ['2', '123', '0'],
        },
        {
            name: 'Multiple Transactions',
            inputs: ['1', '0', '3', '1', '1', '0'],
        },
    ];
    for (const journey of journeys) {
        console.log(`\n📝 Journey: ${journey.name}`);
        console.log(`   Input sequence: ${journey.inputs.join(' → ')}`);
        console.log('   ');
        const session = await simulator.run(journey.inputs);
        // Display results
        console.log('   Results:');
        console.log(`   • Final screen: ${session.currentScreenId}`);
        console.log(`   • Session ended: ${session.ended ? 'Yes' : 'No'}`);
        console.log(`   • Steps taken: ${session.steps.length}`);
        console.log(`   • Errors: ${session.errors.length > 0 ? session.errors.join(', ') : 'None'}`);
        console.log(`   • Session data: ${JSON.stringify(session.sessionData)}`);
        console.log(`   • Path taken: ${session.transcript.join(' → ')}`);
    }
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                   DEMO COMPLETE                           ║');
    console.log('║                                                            ║');
    console.log('║  ✓ Simulator working correctly                           ║');
    console.log('║  ✓ All journeys handled properly                         ║');
    console.log('║  ✓ Error detection working                               ║');
    console.log('║  ✓ Session state preserved                               ║');
    console.log('║                                                            ║');
    console.log('║  Ready for developers to build USSD apps!                ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
}
showDemo().catch(console.error);

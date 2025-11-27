import { USSDApp, Session } from '../core/types';
/**
 * Simulates USSD sessions
 */
export declare class Simulator {
    private app;
    private validator;
    constructor(app: USSDApp);
    /**
     * Run a simulated session with the given inputs
     */
    run(inputs: string[]): Promise<Session>;
    private showScreen;
    private processInput;
    private generateSessionId;
}
//# sourceMappingURL=simulator.d.ts.map
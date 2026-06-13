import { TestRunInput, TestRunResult } from '@ai-orchestrator/shared';

export const TEST_RUNNER = Symbol('TEST_RUNNER');

export interface ITestRunner {
  run(input: TestRunInput): Promise<TestRunResult>;
}
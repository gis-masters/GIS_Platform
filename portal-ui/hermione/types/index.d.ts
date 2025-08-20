import { GlobalHelper, TestDefinition, TestDefinitionCallback, Test } from 'hermione';

declare const it: TestDefinition | { only: TestDefinition };
declare const beforeEach: (callback?: TestDefinitionCallback) => Test;

import { validateEmailForLogin, extractDomain, isValidDomain } from '../src/utils/domainValidator';
import { RESTRICTED_ERROR_MESSAGE, DEFAULT_ALLOWED_DOMAIN } from '../src/utils/constants';

console.log('--- RUNNING DOMAIN RESTRICTION VALIDATION TESTS ---');

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Allowed Domain - hbplus.fit
const test1 = validateEmailForLogin('example@hbplus.fit');
assert(test1.isValid === true, 'Accepts example@hbplus.fit');
assert(test1.domain === 'hbplus.fit', 'Extracts domain hbplus.fit correctly');

// 2. Case Insensitivity
const test2 = validateEmailForLogin('Sarah.Connor@HBPLUS.FIT');
assert(test2.isValid === true, 'Accepts uppercase Sarah.Connor@HBPLUS.FIT');

// 3. Restricted Domain - Gmail
const test3 = validateEmailForLogin('example@gmail.com');
assert(test3.isValid === false, 'Rejects example@gmail.com');
assert(
  test3.error === RESTRICTED_ERROR_MESSAGE,
  `Returns exact error message: "${RESTRICTED_ERROR_MESSAGE}"`
);

// 4. Restricted Domain - Yahoo
const test4 = validateEmailForLogin('user@yahoo.com');
assert(test4.isValid === false, 'Rejects user@yahoo.com');
assert(test4.error === RESTRICTED_ERROR_MESSAGE, 'Returns standard restriction error for Yahoo');

// 5. Invalid email format
const test5 = validateEmailForLogin('invalid-email');
assert(test5.isValid === false, 'Rejects non-email string');
assert(test5.error === 'Invalid email address format.', 'Identifies invalid email format');

// 6. Subdomain matching
const test6 = validateEmailForLogin('eng@dev.hbplus.fit');
assert(test6.isValid === true, 'Accepts subdomain dev.hbplus.fit');

// 7. Domain Extraction
assert(extractDomain('user.name@HBPLUS.FIT') === 'hbplus.fit', 'extractDomain normalizes lowercase');
assert(extractDomain('') === '', 'extractDomain handles empty string');

console.log(`\nResults: ${passed}/${total} tests passed!`);

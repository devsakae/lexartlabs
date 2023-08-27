const cyclotron = require('./cyclotron');

describe('Function validation tests', () => {
  const ERROR_INFO = 'ERROR: Use cyclotron([particle, matrix])';
  const ERROR_PARTICLE = 'ERROR: Please inform valid particle';
  const ERROR_MATRIX = 'ERROR: Please inform matrix type number 4 or higher';
  test('#1 Gets error if called with empty or wrong params', () => {
    expect(cyclotron()).toBe(ERROR_INFO);
    expect(cyclotron({})).toBe(ERROR_INFO);
    expect(cyclotron([])).toBe(ERROR_INFO);
    expect(cyclotron({ particle: 'e', matrix: 5 })).toBe(ERROR_INFO);
    expect(cyclotron('notarray')).toBe(ERROR_INFO);
    expect(cyclotron(666)).toBe(ERROR_INFO);
    expect(cyclotron('e', 5)).toBe(ERROR_INFO);
  });
  test('#2 Particle validation tests', () => {
    expect(cyclotron([5, 5])).toBe(ERROR_PARTICLE);
    expect(cyclotron(['ImString', 5])).toBe(ERROR_PARTICLE);
    expect(cyclotron([['StringInsideArray'], 5])).toBe(ERROR_PARTICLE);
  });
  test('#3 Matrix > 4 validation tests', () => {
    expect(cyclotron(['e'])).toBe(ERROR_MATRIX);
    expect(cyclotron(['e', 'ImString'])).toBe(ERROR_MATRIX);
    expect(cyclotron(['e', [5]])).toBe(ERROR_MATRIX);
    expect(cyclotron(['e', 0])).toBe(ERROR_MATRIX);
    expect(cyclotron(['e', 3])).toBe(ERROR_MATRIX);
  });
});

describe('Check cyclotron function answers', () => {
  const ELECTRON_ROW = ['e', 'e', 'e', 'e'];
  const PROTON_ROW = ['p', 'p', 'p', 'p'];
  const NEUTRON_ROW = ['n', 'n', 'n', 'n'];

  test('#1 Function called with only matrix value 4', () => {
    const TEST_CASE_1 = cyclotron([4]); // Calls function just once
    expect(TEST_CASE_1).toHaveLength(4);
    expect(TEST_CASE_1).toContainEqual([1, 1, 1, 1]);
    expect(TEST_CASE_1).not.toContainEqual(ELECTRON_ROW);
    expect(TEST_CASE_1).not.toContainEqual(PROTON_ROW);
    expect(TEST_CASE_1).not.toContainEqual(NEUTRON_ROW);
  });
  test('#2 Accelerating neutron', () => {
    const TEST_CASE_2 = cyclotron(['n', 4]); // Calls function just once
    expect(TEST_CASE_2).toHaveLength(4);
    expect(TEST_CASE_2).toContainEqual([1, 1, 1, 1]);
    expect(TEST_CASE_2).toContainEqual(NEUTRON_ROW);
    expect(TEST_CASE_2).not.toContainEqual(ELECTRON_ROW);
    expect(TEST_CASE_2).not.toContainEqual(PROTON_ROW);
  });
  test('#3 Accelerating electron', () => {
    const TEST_CASE_3 = cyclotron(['e', 4]); // Calls function just once
    expect(TEST_CASE_3).toHaveLength(4);
    expect(TEST_CASE_3).toContainEqual(ELECTRON_ROW);
    expect(TEST_CASE_3).toContainEqual([1, 1, 1, 'e']);
    expect(TEST_CASE_3).not.toContainEqual(NEUTRON_ROW);
    expect(TEST_CASE_3).not.toContainEqual(PROTON_ROW);
  });
  test('#4 Accelerating proton', () => {
    const TEST_CASE_4 = cyclotron(['p', 4]); // Calls function just once
    expect(TEST_CASE_4).toHaveLength(4);
    expect(TEST_CASE_4).toContainEqual(PROTON_ROW);
    expect(TEST_CASE_4).toContainEqual(['p', 1, 1, 'p']);
    expect(TEST_CASE_4).toContainEqual(['p', 1, 'p', 'p']);
    expect(TEST_CASE_4).toContainEqual(['p', 'p', 'p', 1]);
    expect(TEST_CASE_4).not.toContainEqual(ELECTRON_ROW);
    expect(TEST_CASE_4).not.toContainEqual(NEUTRON_ROW);
  });
})
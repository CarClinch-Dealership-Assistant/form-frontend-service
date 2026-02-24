/**
 * @jest-environment jsdom
 */

// Import functions from your script file
const { validateEmail, validatePhone } = require('../script.js');

describe('Contact Form Logic', () => {
  
  test('email validation works correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('not-an-email')).toBe(false);
  });

  test('phone validation requires at least 10 digits', () => {
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('123-456-7890')).toBe(true);
    expect(validatePhone('123')).toBe(false);
  });

});

describe('loadVehicles Integration', () => {
  beforeEach(() => {
    // Manually create the element that the function expects to find
    document.body.innerHTML = '<select id="vehicleId"></select>';
    global.fetch = jest.fn();
  });

  test('populates select dropdown with vehicle data', async () => {
    const { loadVehicles } = require('../script.js');

    // Mock a successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        vehicles: [{ id: 'vehicle_3e9f1a2c33', year: 2007, make: 'Mazda', model: 'MX-5', mileage: 91800, trim:'GT', status: 1 }]
      }),
    });

    await loadVehicles();

    const select = document.getElementById('vehicleId');
    expect(select.innerHTML).toContain('2007 Mazda MX-5 GT');
  });
});
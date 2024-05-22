const { average } = require('../utils/for_testing')

const reverse = require('../utils/for_testing').reverse
describe('reverse', () => {
	test('reverse of a', () => {
		const result = reverse('a')
		expect(result).toBe('a')
	})

	test('reverse of react', () => {
		const result = reverse('react')
		expect(result).toBe('tcaer')
	})

	test('reverse of releveler', () => {
		const result = reverse('releveler')
		expect(result).toBe('releveler')
	})

	test('Sum of array', () => {
		const result = average([1, 2, 3, 4, 5])
		expect(result).toBe(3)
	})
})
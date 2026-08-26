import { Decimal } from '@prisma/client/runtime/library'
import { SellingService } from '../../../src/modules/selling/selling.service'
import { sumSoldProductsProfit } from '../../../src/modules/selling/selling.repository'

describe('sumSoldProductsProfit', () => {
	it('product MV cost 0 bo‘lsa, Product.cost dan foydalanishi kerak', () => {
		const profit = sumSoldProductsProfit([{ price: new Decimal(100), cost: new Decimal(0), count: 2, product: { cost: new Decimal(40) } }])

		// (100 - 40) * 2 = 120
		expect(profit.equals(new Decimal(120))).toBe(true)
	})

	it('product MV da cost yozilgan bo‘lsa, shuni ishlatishi kerak', () => {
		const profit = sumSoldProductsProfit([{ price: new Decimal(50), cost: new Decimal(10), count: 1, product: { cost: new Decimal(99) } }])

		// (50 - 10) * 1 = 40 — product.cost e'tiborsiz
		expect(profit.equals(new Decimal(40))).toBe(true)
	})

	it('bir nechta mahsulot foydasini yig‘ishi kerak', () => {
		const profit = sumSoldProductsProfit([
			{ price: new Decimal(100), cost: new Decimal(0), count: 2, product: { cost: new Decimal(40) } },
			{ price: new Decimal(50), cost: new Decimal(10), count: 3, product: { cost: new Decimal(99) } },
		])

		// 120 + (50 - 10) * 3 = 240
		expect(profit.equals(new Decimal(240))).toBe(true)
	})

	it('zararga sotilganda manfiy foyda qaytarishi kerak', () => {
		const profit = sumSoldProductsProfit([{ price: new Decimal(30), cost: new Decimal(0), count: 1, product: { cost: new Decimal(50) } }])

		expect(profit.equals(new Decimal(-20))).toBe(true)
	})

	it('bo‘sh ro‘yxat uchun 0 qaytarishi kerak', () => {
		expect(sumSoldProductsProfit([]).equals(new Decimal(0))).toBe(true)
	})
})

describe('SellingService.getProfitStats', () => {
	const mockSellingRepository = {
		sumProfitByDateRange: jest.fn(),
		getPeriodStats: jest.fn(),
	}

	let service: SellingService

	beforeEach(() => {
		service = new SellingService(mockSellingRepository as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any)
		jest.clearAllMocks()
	})

	it('daily, weekly, monthly, yearly foydani qaytarishi kerak', async () => {
		mockSellingRepository.sumProfitByDateRange
			.mockResolvedValueOnce(new Decimal(10))
			.mockResolvedValueOnce(new Decimal(20))
			.mockResolvedValueOnce(new Decimal(30))
			.mockResolvedValueOnce(new Decimal(40))

		const result = await service.getProfitStats({})

		expect(mockSellingRepository.sumProfitByDateRange).toHaveBeenCalledTimes(4)
		expect(result.data).toEqual({
			daily: new Decimal(10),
			weekly: new Decimal(20),
			monthly: new Decimal(30),
			yearly: new Decimal(40),
		})
		expect(result.success.messages).toEqual(['get profit stats success'])
	})

	it('har bir period uchun kun boshi va oxirigacha filter yuborishi kerak', async () => {
		mockSellingRepository.sumProfitByDateRange.mockResolvedValue(new Decimal(0))

		await service.getProfitStats({})

		const calls = mockSellingRepository.sumProfitByDateRange.mock.calls
		expect(calls).toHaveLength(4)

		for (const [arg] of calls) {
			expect(arg.startDate).toBeInstanceOf(Date)
			expect(arg.endDate).toBeInstanceOf(Date)
			expect(arg.startDate.getHours()).toBe(0)
			expect(arg.startDate.getMinutes()).toBe(0)
			expect(arg.endDate.getHours()).toBe(23)
			expect(arg.endDate.getMinutes()).toBe(59)
			expect(arg.startDate.getTime()).toBeLessThanOrEqual(arg.endDate.getTime())
		}
	})
})

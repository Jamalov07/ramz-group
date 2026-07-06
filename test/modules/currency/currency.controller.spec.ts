import { Test, TestingModule } from '@nestjs/testing'
import { CurrencyController } from '../../../src/modules/currency/currency.controller'
import { CurrencyService } from '../../../src/modules/currency/currency.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockCurrencyService = {
	findMany: jest.fn(),
	findOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

describe('CurrencyController', () => {
	let controller: CurrencyController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CurrencyController],
			providers: [{ provide: CurrencyService, useValue: mockCurrencyService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<CurrencyController>(CurrencyController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /currency/many)', () => {
		it("barcha valyutalarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { currencies: [], total: 0 } }
			mockCurrencyService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockCurrencyService.findMany).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('findOne (GET /currency/one)', () => {
		it("bitta valyutani qaytarishi kerak", async () => {
			const query = { id: 'currency-id-1' } as any
			const mockResult = { data: { id: 'currency-id-1', name: 'USD', rate: 12700 } }
			mockCurrencyService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockCurrencyService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOne (POST /currency/one)', () => {
		it("yangi valyuta yaratishi kerak", async () => {
			const body = { name: 'EUR', rate: 13500 } as any
			const mockResult = { data: { id: 'currency-id-1' } }
			mockCurrencyService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(body)

			expect(mockCurrencyService.createOne).toHaveBeenCalledWith(body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /currency/one)', () => {
		it("valyutani yangilashi kerak", async () => {
			const query = { id: 'currency-id-1' } as any
			const body = { rate: 14000 } as any
			const mockResult = { data: { id: 'currency-id-1' } }
			mockCurrencyService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockCurrencyService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /currency/one)', () => {
		it("valyutani o'chirishi kerak", async () => {
			const query = { id: 'currency-id-1' } as any
			const mockResult = { data: null }
			mockCurrencyService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockCurrencyService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

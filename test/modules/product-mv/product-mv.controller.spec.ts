import { Test, TestingModule } from '@nestjs/testing'
import { ProductMVController } from '../../../src/modules/product-mv/product-mv.controller'
import { ProductMVService } from '../../../src/modules/product-mv/product-mv.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockProductMVService = {
	findMany: jest.fn(),
	findManyProductStats: jest.fn(),
	findOne: jest.fn(),
	createOneSelling: jest.fn(),
	createOneArrival: jest.fn(),
	createOneReturning: jest.fn(),
	updateOneSelling: jest.fn(),
	updateOneArrival: jest.fn(),
	updateOneReturning: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRequest = { user: { id: 'staff-id-1', token: 'token' } } as any

describe('ProductMVController', () => {
	let controller: ProductMVController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductMVController],
			providers: [{ provide: ProductMVService, useValue: mockProductMVService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<ProductMVController>(ProductMVController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /product-mv/many)', () => {
		it("barcha mahsulot harakatlarini qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { productMVs: [], total: 0 } }
			mockProductMVService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockProductMVService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('findManyProductStats (GET /product-mv/many-product-stats)', () => {
		it("mahsulot statistikalarini qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: [] }
			mockProductMVService.findManyProductStats.mockResolvedValue(mockResult)

			const result = await controller.findManyProductStats(query)

			expect(mockProductMVService.findManyProductStats).toHaveBeenCalledWith({ ...query, pagination: false, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('getOne (GET /product-mv/one)', () => {
		it("bitta mahsulot harakatini qaytarishi kerak", async () => {
			const query = { id: 'product-mv-id-1' } as any
			const mockResult = { data: { id: 'product-mv-id-1' } }
			mockProductMVService.findOne.mockResolvedValue(mockResult)

			const result = await controller.getOne(query)

			expect(mockProductMVService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOneSelling (POST /product-mv/selling/one)', () => {
		it("sotuvga mahsulot harakati yaratishi kerak", async () => {
			const body = { productId: 'product-id-1', sellingId: 'selling-id-1', count: 5 } as any
			const mockResult = { data: { id: 'product-mv-id-1' } }
			mockProductMVService.createOneSelling.mockResolvedValue(mockResult)

			const result = await controller.createOneSelling(mockRequest, body)

			expect(mockProductMVService.createOneSelling).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOneArrival (POST /product-mv/arrival/one)', () => {
		it("kelishga mahsulot harakati yaratishi kerak", async () => {
			const body = { productId: 'product-id-1', arrivalId: 'arrival-id-1', count: 10 } as any
			const mockResult = { data: { id: 'product-mv-id-1' } }
			mockProductMVService.createOneArrival.mockResolvedValue(mockResult)

			const result = await controller.createOneArrival(mockRequest, body)

			expect(mockProductMVService.createOneArrival).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOneReturning (POST /product-mv/returning/one)', () => {
		it("qaytarishga mahsulot harakati yaratishi kerak", async () => {
			const body = { productId: 'product-id-1', returningId: 'returning-id-1', count: 2 } as any
			const mockResult = { data: { id: 'product-mv-id-1' } }
			mockProductMVService.createOneReturning.mockResolvedValue(mockResult)

			const result = await controller.createOneReturning(mockRequest, body)

			expect(mockProductMVService.createOneReturning).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOneSelling (PATCH /product-mv/selling/one)', () => {
		it("sotuv mahsulot harakatini yangilashi kerak", async () => {
			const query = { id: 'product-mv-id-1' } as any
			const body = { count: 8 } as any
			const mockResult = { data: { id: 'product-mv-id-1' } }
			mockProductMVService.updateOneSelling.mockResolvedValue(mockResult)

			const result = await controller.updateOneSelling(query, body)

			expect(mockProductMVService.updateOneSelling).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOneArrival (PATCH /product-mv/arrival/one)', () => {
		it("kelish mahsulot harakatini yangilashi kerak", async () => {
			const query = { id: 'product-mv-id-1' } as any
			const body = { count: 15 } as any
			const mockResult = { data: { id: 'product-mv-id-1' } }
			mockProductMVService.updateOneArrival.mockResolvedValue(mockResult)

			const result = await controller.updateOneArrival(query, body)

			expect(mockProductMVService.updateOneArrival).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOneReturning (PATCH /product-mv/returning/one)', () => {
		it("qaytarish mahsulot harakatini yangilashi kerak", async () => {
			const query = { id: 'product-mv-id-1' } as any
			const body = { count: 3 } as any
			const mockResult = { data: { id: 'product-mv-id-1' } }
			mockProductMVService.updateOneReturning.mockResolvedValue(mockResult)

			const result = await controller.updateOneReturning(query, body)

			expect(mockProductMVService.updateOneReturning).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /product-mv/one)', () => {
		it("mahsulot harakatini o'chirishi kerak", async () => {
			const query = { id: 'product-mv-id-1' } as any
			const mockResult = { data: null }
			mockProductMVService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockProductMVService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

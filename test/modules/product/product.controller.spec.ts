import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from '../../../src/modules/product/product.controller'
import { ProductService } from '../../../src/modules/product/product.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockProductService = {
	findManyNew: jest.fn(),
	findMany: jest.fn(),
	excelDownloadMany: jest.fn(),
	findOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('ProductController', () => {
	let controller: ProductController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductController],
			providers: [{ provide: ProductService, useValue: mockProductService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<ProductController>(ProductController)
		jest.clearAllMocks()
	})

	describe('findManyNew (GET /product/many)', () => {
		it("barcha mahsulotlarni (optimized) qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { products: [], total: 0 } }
			mockProductService.findManyNew.mockResolvedValue(mockResult)

			const result = await controller.findManyNew(query)

			expect(mockProductService.findManyNew).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('findMany (GET /product/many/old)', () => {
		it("barcha mahsulotlarni (eski) qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { products: [], total: 0 } }
			mockProductService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockProductService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /product/excel-download/many)', () => {
		it("mahsulotlar excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockProductService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockProductService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('getOne (GET /product/one)', () => {
		it("bitta mahsulotni qaytarishi kerak", async () => {
			const query = { id: 'product-id-1' } as any
			const mockResult = { data: { id: 'product-id-1', name: 'Test Product' } }
			mockProductService.findOne.mockResolvedValue(mockResult)

			const result = await controller.getOne(query)

			expect(mockProductService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOne (POST /product/one)', () => {
		it("yangi mahsulot yaratishi kerak", async () => {
			const body = { name: 'Yangi Mahsulot', price: 50000, unit: 'dona' } as any
			const mockResult = { data: { id: 'product-id-1' } }
			mockProductService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(body)

			expect(mockProductService.createOne).toHaveBeenCalledWith(body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /product/one)', () => {
		it("mahsulotni yangilashi kerak", async () => {
			const query = { id: 'product-id-1' } as any
			const body = { price: 60000 } as any
			const mockResult = { data: { id: 'product-id-1' } }
			mockProductService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockProductService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /product/one)', () => {
		it("mahsulotni o'chirishi kerak", async () => {
			const query = { id: 'product-id-1' } as any
			const mockResult = { data: null }
			mockProductService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockProductService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

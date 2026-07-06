import { Test, TestingModule } from '@nestjs/testing'
import { SupplierController } from '../../../src/modules/supplier/supplier.controller'
import { SupplierService } from '../../../src/modules/supplier/supplier.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockSupplierService = {
	findMany: jest.fn(),
	excelDownloadMany: jest.fn(),
	findOne: jest.fn(),
	excelDownloadOne: jest.fn(),
	excelWithProductDownloadOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('SupplierController', () => {
	let controller: SupplierController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SupplierController],
			providers: [{ provide: SupplierService, useValue: mockSupplierService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<SupplierController>(SupplierController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /supplier/many)', () => {
		it("barcha ta'minotchilarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { suppliers: [], total: 0 } }
			mockSupplierService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockSupplierService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /supplier/excel-download/many)', () => {
		it("ko'p ta'minotchilar excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockSupplierService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockSupplierService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('findOne (GET /supplier/one)', () => {
		it("bitta ta'minotchini qaytarishi kerak", async () => {
			const query = { id: 'supplier-id-1' } as any
			const mockResult = { data: { id: 'supplier-id-1', fullName: 'Test Supplier' } }
			mockSupplierService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockSupplierService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadOne (GET /supplier/excel-download/one)', () => {
		it("bitta ta'minotchi excel faylini yuklab olishi kerak", async () => {
			const query = { id: 'supplier-id-1' } as any
			mockSupplierService.excelDownloadOne.mockResolvedValue(undefined)

			await controller.excelDownloadOne(mockRes, query)

			expect(mockSupplierService.excelDownloadOne).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('excelWithProductDownloadOne (GET /supplier/excel-with-product-download/one)', () => {
		it("mahsulotlar bilan bitta ta'minotchi excel faylini yuklab olishi kerak", async () => {
			const query = { id: 'supplier-id-1' } as any
			mockSupplierService.excelWithProductDownloadOne.mockResolvedValue(undefined)

			await controller.excelWithProductDownloadOne(mockRes, query)

			expect(mockSupplierService.excelWithProductDownloadOne).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('createOne (POST /supplier/one)', () => {
		it("yangi ta'minotchi yaratishi kerak", async () => {
			const body = { fullName: 'Yangi Supplier', phone: '+998901234567' } as any
			const mockResult = { data: { id: 'supplier-id-1' } }
			mockSupplierService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(body)

			expect(mockSupplierService.createOne).toHaveBeenCalledWith(body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /supplier/one)', () => {
		it("ta'minotchini yangilashi kerak", async () => {
			const query = { id: 'supplier-id-1' } as any
			const body = { fullName: 'Updated Supplier' } as any
			const mockResult = { data: { id: 'supplier-id-1' } }
			mockSupplierService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockSupplierService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /supplier/one)', () => {
		it("ta'minotchini o'chirishi kerak", async () => {
			const query = { id: 'supplier-id-1' } as any
			const mockResult = { data: null }
			mockSupplierService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockSupplierService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

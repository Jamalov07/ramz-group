import { Test, TestingModule } from '@nestjs/testing'
import { SupplierPaymentController } from '../../../src/modules/supplier-payment/supplier-payment.controller'
import { SupplierPaymentService } from '../../../src/modules/supplier-payment/supplier-payment.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockSupplierPaymentService = {
	findMany: jest.fn(),
	excelDownloadMany: jest.fn(),
	findOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRequest = { user: { id: 'staff-id-1', token: 'token' } } as any
const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('SupplierPaymentController', () => {
	let controller: SupplierPaymentController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SupplierPaymentController],
			providers: [{ provide: SupplierPaymentService, useValue: mockSupplierPaymentService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<SupplierPaymentController>(SupplierPaymentController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /supplier-payment/many)', () => {
		it("barcha ta'minotchi to'lovlarini qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { payments: [], total: 0 } }
			mockSupplierPaymentService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockSupplierPaymentService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /supplier-payment/excel-download/many)', () => {
		it("ko'p to'lovlar excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockSupplierPaymentService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockSupplierPaymentService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('findOne (GET /supplier-payment/one)', () => {
		it("bitta ta'minotchi to'lovini qaytarishi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const mockResult = { data: { id: 'payment-id-1', amount: 5000000 } }
			mockSupplierPaymentService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockSupplierPaymentService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOne (POST /supplier-payment/one)', () => {
		it("yangi ta'minotchi to'lovi yaratishi kerak", async () => {
			const body = { supplierId: 'supplier-id-1', amount: 5000000, paymentType: 'TRANSFER' } as any
			const mockResult = { data: { id: 'payment-id-1' } }
			mockSupplierPaymentService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(mockRequest, body)

			expect(mockSupplierPaymentService.createOne).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /supplier-payment/one)', () => {
		it("ta'minotchi to'lovini yangilashi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const body = { amount: 6000000 } as any
			const mockResult = { data: { id: 'payment-id-1' } }
			mockSupplierPaymentService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockSupplierPaymentService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /supplier-payment/one)', () => {
		it("ta'minotchi to'lovini o'chirishi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const mockResult = { data: null }
			mockSupplierPaymentService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockSupplierPaymentService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

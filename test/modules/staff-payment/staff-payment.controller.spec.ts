import { Test, TestingModule } from '@nestjs/testing'
import { StaffPaymentController } from '../../../src/modules/staff-payment/staff-payment.controller'
import { StaffPaymentService } from '../../../src/modules/staff-payment/staff-payment.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockStaffPaymentService = {
	findMany: jest.fn(),
	excelDownloadMany: jest.fn(),
	findOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRequest = { user: { id: 'staff-id-1', token: 'token' } } as any
const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('StaffPaymentController', () => {
	let controller: StaffPaymentController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StaffPaymentController],
			providers: [{ provide: StaffPaymentService, useValue: mockStaffPaymentService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<StaffPaymentController>(StaffPaymentController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /staff-payment/many)', () => {
		it("barcha xodim to'lovlarini qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { payments: [], total: 0 } }
			mockStaffPaymentService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockStaffPaymentService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /staff-payment/excel-download/many)', () => {
		it("ko'p xodim to'lovlari excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockStaffPaymentService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockStaffPaymentService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('findOne (GET /staff-payment/one)', () => {
		it("bitta xodim to'lovini qaytarishi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const mockResult = { data: { id: 'payment-id-1', amount: 2000000 } }
			mockStaffPaymentService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockStaffPaymentService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOne (POST /staff-payment/one)', () => {
		it("yangi xodim to'lovi yaratishi kerak", async () => {
			const body = { staffId: 'staff-id-1', amount: 2000000, paymentType: 'CASH' } as any
			const mockResult = { data: { id: 'payment-id-1' } }
			mockStaffPaymentService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(mockRequest, body)

			expect(mockStaffPaymentService.createOne).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /staff-payment/one)', () => {
		it("xodim to'lovini yangilashi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const body = { amount: 2500000 } as any
			const mockResult = { data: { id: 'payment-id-1' } }
			mockStaffPaymentService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockStaffPaymentService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /staff-payment/one)', () => {
		it("xodim to'lovini o'chirishi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const mockResult = { data: null }
			mockStaffPaymentService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockStaffPaymentService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

import { Test, TestingModule } from '@nestjs/testing'
import { ClientPaymentController } from '../../../src/modules/client-payment/client-payment.controller'
import { ClientPaymentService } from '../../../src/modules/client-payment/client-payment.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockClientPaymentService = {
	findMany: jest.fn(),
	excelDownloadMany: jest.fn(),
	findOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRequest = { user: { id: 'staff-id-1', token: 'token' } } as any
const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('ClientPaymentController', () => {
	let controller: ClientPaymentController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClientPaymentController],
			providers: [{ provide: ClientPaymentService, useValue: mockClientPaymentService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<ClientPaymentController>(ClientPaymentController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /client-payment/many)', () => {
		it("barcha mijoz to'lovlarini qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { payments: [], total: 0 } }
			mockClientPaymentService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockClientPaymentService.findMany).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /client-payment/excel-download/many)', () => {
		it("ko'p to'lovlar excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockClientPaymentService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockClientPaymentService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('findOne (GET /client-payment/one)', () => {
		it("bitta mijoz to'lovini qaytarishi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const mockResult = { data: { id: 'payment-id-1', amount: 100000 } }
			mockClientPaymentService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockClientPaymentService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOne (POST /client-payment/one)', () => {
		it("yangi mijoz to'lovi yaratishi kerak", async () => {
			const body = { clientId: 'client-id-1', amount: 100000, paymentType: 'CASH' } as any
			const mockResult = { data: { id: 'payment-id-1' } }
			mockClientPaymentService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(mockRequest, body)

			expect(mockClientPaymentService.createOne).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /client-payment/one)', () => {
		it("mijoz to'lovini yangilashi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const body = { amount: 200000 } as any
			const mockResult = { data: { id: 'payment-id-1' } }
			mockClientPaymentService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockClientPaymentService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /client-payment/one)', () => {
		it("mijoz to'lovini o'chirishi kerak", async () => {
			const query = { id: 'payment-id-1' } as any
			const mockResult = { data: null }
			mockClientPaymentService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockClientPaymentService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

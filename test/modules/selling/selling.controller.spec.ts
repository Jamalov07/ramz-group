import { Test, TestingModule } from '@nestjs/testing'
import { SellingController } from '../../../src/modules/selling/selling.controller'
import { SellingService } from '../../../src/modules/selling/selling.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockSellingService = {
	findMany: jest.fn(),
	excelDownloadMany: jest.fn(),
	getTotalStats: jest.fn(),
	getPeriodStats: jest.fn(),
	findOne: jest.fn(),
	excelDownloadOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRequest = { user: { id: 'staff-id-1', token: 'token' } } as any
const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('SellingController', () => {
	let controller: SellingController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SellingController],
			providers: [{ provide: SellingService, useValue: mockSellingService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<SellingController>(SellingController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /selling/many)', () => {
		it("barcha sotuvlarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { sellings: [], total: 0 } }
			mockSellingService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockSellingService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /selling/excel-download/many)', () => {
		it("ko'p sotuvlar excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockSellingService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockSellingService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('getTotalStats (GET /selling/total-stats)', () => {
		it("umumiy statistikani qaytarishi kerak", async () => {
			const query = { startDate: '2024-01-01', endDate: '2024-12-31' } as any
			const mockResult = { data: { totalAmount: 5000000, totalCount: 100 } }
			mockSellingService.getTotalStats.mockResolvedValue(mockResult)

			const result = await controller.getTotalStats(query)

			expect(mockSellingService.getTotalStats).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('getPeriodStats (GET /selling/period-stats)', () => {
		it("davr statistikasini qaytarishi kerak", async () => {
			const query = { period: 'monthly' } as any
			const mockResult = { data: { stats: [] } }
			mockSellingService.getPeriodStats.mockResolvedValue(mockResult)

			const result = await controller.getPeriodStats(query)

			expect(mockSellingService.getPeriodStats).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('findOne (GET /selling/one)', () => {
		it("bitta sotuvni qaytarishi kerak", async () => {
			const query = { id: 'selling-id-1' } as any
			const mockResult = { data: { id: 'selling-id-1' } }
			mockSellingService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockSellingService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadOne (GET /selling/excel-download/one)', () => {
		it("bitta sotuv excel faylini yuklab olishi kerak", async () => {
			const query = { id: 'selling-id-1' } as any
			mockSellingService.excelDownloadOne.mockResolvedValue(undefined)

			await controller.excelDownloadOne(mockRes, query)

			expect(mockSellingService.excelDownloadOne).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('createOne (POST /selling/one)', () => {
		it("yangi sotuv yaratishi kerak", async () => {
			const body = { clientId: 'client-id-1', products: [], totalAmount: 150000 } as any
			const mockResult = { data: { id: 'selling-id-1' } }
			mockSellingService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(mockRequest, body)

			expect(mockSellingService.createOne).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /selling/one)', () => {
		it("sotuvni yangilashi kerak", async () => {
			const query = { id: 'selling-id-1' } as any
			const body = { description: 'updated note' } as any
			const mockResult = { data: { id: 'selling-id-1' } }
			mockSellingService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(mockRequest, query, body)

			expect(mockSellingService.updateOne).toHaveBeenCalledWith(mockRequest, query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /selling/one)', () => {
		it("sotuvni o'chirishi kerak", async () => {
			const query = { id: 'selling-id-1' } as any
			const mockResult = { data: null }
			mockSellingService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockSellingService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

import { Test, TestingModule } from '@nestjs/testing'
import { ReturningController } from '../../../src/modules/returning/returning.controller'
import { ReturningService } from '../../../src/modules/returning/returning.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockReturningService = {
	findMany: jest.fn(),
	excelDownloadMany: jest.fn(),
	findOne: jest.fn(),
	excelDownloadOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRequest = { user: { id: 'staff-id-1', token: 'token' } } as any
const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('ReturningController', () => {
	let controller: ReturningController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ReturningController],
			providers: [{ provide: ReturningService, useValue: mockReturningService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<ReturningController>(ReturningController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /returning/many)', () => {
		it("barcha qaytarishlarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { returnings: [], total: 0 } }
			mockReturningService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockReturningService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /returning/excel-download/many)', () => {
		it("ko'p qaytarishlar excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockReturningService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockReturningService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('findOne (GET /returning/one)', () => {
		it("bitta qaytarishni qaytarishi kerak", async () => {
			const query = { id: 'returning-id-1' } as any
			const mockResult = { data: { id: 'returning-id-1' } }
			mockReturningService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockReturningService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadOne (GET /returning/excel-download/one)', () => {
		it("bitta qaytarish excel faylini yuklab olishi kerak", async () => {
			const query = { id: 'returning-id-1' } as any
			mockReturningService.excelDownloadOne.mockResolvedValue(undefined)

			await controller.excelDownloadOne(mockRes, query)

			expect(mockReturningService.excelDownloadOne).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('createOne (POST /returning/one)', () => {
		it("yangi qaytarish yaratishi kerak", async () => {
			const body = { clientId: 'client-id-1', products: [] } as any
			const mockResult = { data: { id: 'returning-id-1' } }
			mockReturningService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(mockRequest, body)

			expect(mockReturningService.createOne).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /returning/one)', () => {
		it("qaytarishni yangilashi kerak", async () => {
			const query = { id: 'returning-id-1' } as any
			const body = { description: 'updated' } as any
			const mockResult = { data: { id: 'returning-id-1' } }
			mockReturningService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockReturningService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /returning/one)', () => {
		it("qaytarishni o'chirishi kerak", async () => {
			const query = { id: 'returning-id-1' } as any
			const mockResult = { data: null }
			mockReturningService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockReturningService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

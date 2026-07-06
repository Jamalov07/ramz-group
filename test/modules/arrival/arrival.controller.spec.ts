import { Test, TestingModule } from '@nestjs/testing'
import { ArrivalController } from '../../../src/modules/arrival/arrival.controller'
import { ArrivalService } from '../../../src/modules/arrival/arrival.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockArrivalService = {
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

describe('ArrivalController', () => {
	let controller: ArrivalController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ArrivalController],
			providers: [{ provide: ArrivalService, useValue: mockArrivalService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<ArrivalController>(ArrivalController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /arrival/many)', () => {
		it("barcha kelishlarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { arrivals: [], total: 0 } }
			mockArrivalService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockArrivalService.findMany).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /arrival/excel-download/many)', () => {
		it("excel faylini yuklab olishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			mockArrivalService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockArrivalService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('findOne (GET /arrival/one)', () => {
		it("bitta kelishni qaytarishi kerak", async () => {
			const query = { id: 'arrival-id-1' } as any
			const mockResult = { data: { id: 'arrival-id-1' } }
			mockArrivalService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockArrivalService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadOne (GET /arrival/excel-download/one)', () => {
		it("bitta kelish excel faylini yuklab olishi kerak", async () => {
			const query = { id: 'arrival-id-1' } as any
			mockArrivalService.excelDownloadOne.mockResolvedValue(undefined)

			await controller.excelDownloadOne(mockRes, query)

			expect(mockArrivalService.excelDownloadOne).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('createOne (POST /arrival/one)', () => {
		it("yangi kelish yaratishi kerak", async () => {
			const body = { supplierId: 'supplier-id-1', products: [] } as any
			const mockResult = { data: { id: 'arrival-id-1' } }
			mockArrivalService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(mockRequest, body)

			expect(mockArrivalService.createOne).toHaveBeenCalledWith(mockRequest, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /arrival/one)', () => {
		it("kelishni yangilashi kerak", async () => {
			const query = { id: 'arrival-id-1' } as any
			const body = { description: 'updated' } as any
			const mockResult = { data: { id: 'arrival-id-1' } }
			mockArrivalService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockArrivalService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /arrival/one)', () => {
		it("kelishni o'chirishi kerak", async () => {
			const query = { id: 'arrival-id-1' } as any
			const mockResult = { data: null }
			mockArrivalService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockArrivalService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

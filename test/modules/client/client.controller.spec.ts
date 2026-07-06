import { Test, TestingModule } from '@nestjs/testing'
import { ClientController } from '../../../src/modules/client/client.controller'
import { ClientService } from '../../../src/modules/client/client.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockClientService = {
	findMany: jest.fn(),
	findManyNew: jest.fn(),
	findManyForReport: jest.fn(),
	excelDownloadMany: jest.fn(),
	findOne: jest.fn(),
	excelDownloadOne: jest.fn(),
	excelWithProductDownloadOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

const mockRes = { setHeader: jest.fn(), end: jest.fn(), status: jest.fn() } as any

describe('ClientController', () => {
	let controller: ClientController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ClientController],
			providers: [{ provide: ClientService, useValue: mockClientService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<ClientController>(ClientController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /client/many/old)', () => {
		it("barcha mijozlarni (eski) qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { clients: [], total: 0 } }
			mockClientService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockClientService.findMany).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('findManyNew (GET /client/many)', () => {
		it("barcha mijozlarni (yangi) qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { clients: [], total: 0 } }
			mockClientService.findManyNew.mockResolvedValue(mockResult)

			const result = await controller.findManyNew(query)

			expect(mockClientService.findManyNew).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('findManyReport (GET /client/many/report)', () => {
		it("mijozlar hisobotini qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { clients: [], total: 0 } }
			mockClientService.findManyForReport.mockResolvedValue(mockResult)

			const result = await controller.findManyReport(query)

			expect(mockClientService.findManyForReport).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadMany (GET /client/excel-download/many)', () => {
		it("ko'p mijozlar excel faylini yuklab olishi kerak", async () => {
			const query = {} as any
			mockClientService.excelDownloadMany.mockResolvedValue(undefined)

			await controller.excelDownloadMany(mockRes, query)

			expect(mockClientService.excelDownloadMany).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('findOne (GET /client/one)', () => {
		it("bitta mijozni qaytarishi kerak", async () => {
			const query = { id: 'client-id-1' } as any
			const mockResult = { data: { id: 'client-id-1', fullName: 'Ali Valiev' } }
			mockClientService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockClientService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('excelDownloadOne (GET /client/excel-download/one)', () => {
		it("bitta mijoz excel faylini yuklab olishi kerak", async () => {
			const query = { id: 'client-id-1' } as any
			mockClientService.excelDownloadOne.mockResolvedValue(undefined)

			await controller.excelDownloadOne(mockRes, query)

			expect(mockClientService.excelDownloadOne).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('excelWithProductDownloadOne (GET /client/excel-with-product-download/one)', () => {
		it("mahsulotlar bilan bitta mijoz excel faylini yuklab olishi kerak", async () => {
			const query = { id: 'client-id-1' } as any
			mockClientService.excelWithProductDownloadOne.mockResolvedValue(undefined)

			await controller.excelWithProductDownloadOne(mockRes, query)

			expect(mockClientService.excelWithProductDownloadOne).toHaveBeenCalledWith(mockRes, query)
		})
	})

	describe('createOne (POST /client/one)', () => {
		it("yangi mijoz yaratishi kerak", async () => {
			const body = { fullName: 'Ali Valiev', phone: '+998901234567' } as any
			const mockResult = { data: { id: 'client-id-1' } }
			mockClientService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(body)

			expect(mockClientService.createOne).toHaveBeenCalledWith(body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /client/one)', () => {
		it("mijozni yangilashi kerak", async () => {
			const query = { id: 'client-id-1' } as any
			const body = { fullName: 'Updated Name' } as any
			const mockResult = { data: { id: 'client-id-1' } }
			mockClientService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockClientService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /client/one)', () => {
		it("mijozni o'chirishi kerak", async () => {
			const query = { id: 'client-id-1' } as any
			const mockResult = { data: null }
			mockClientService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockClientService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

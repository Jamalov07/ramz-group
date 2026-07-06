import { Test, TestingModule } from '@nestjs/testing'
import { PermissionController } from '../../../src/modules/permission/permission.controller'
import { PermissionService } from '../../../src/modules/permission/permission.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockPermissionService = {
	findMany: jest.fn(),
	findOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

describe('PermissionController', () => {
	let controller: PermissionController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PermissionController],
			providers: [{ provide: PermissionService, useValue: mockPermissionService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<PermissionController>(PermissionController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /permission/many)', () => {
		it("barcha ruxsatlarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { permissions: [], total: 0 } }
			mockPermissionService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockPermissionService.findMany).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('getOne (GET /permission/one)', () => {
		it("bitta ruxsatni qaytarishi kerak", async () => {
			const query = { id: 'permission-id-1' } as any
			const mockResult = { data: { id: 'permission-id-1', staffId: 'staff-id-1' } }
			mockPermissionService.findOne.mockResolvedValue(mockResult)

			const result = await controller.getOne(query)

			expect(mockPermissionService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOne (POST /permission/one)', () => {
		it("yangi ruxsat yaratishi kerak", async () => {
			const body = { staffId: 'staff-id-1', actions: [] } as any
			const mockResult = { data: { id: 'permission-id-1' } }
			mockPermissionService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(body)

			expect(mockPermissionService.createOne).toHaveBeenCalledWith(body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /permission/one)', () => {
		it("ruxsatni yangilashi kerak", async () => {
			const query = { id: 'permission-id-1' } as any
			const body = { actions: ['read', 'write'] } as any
			const mockResult = { data: { id: 'permission-id-1' } }
			mockPermissionService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockPermissionService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /permission/one)', () => {
		it("ruxsatni o'chirishi kerak", async () => {
			const query = { id: 'permission-id-1' } as any
			const mockResult = { data: null }
			mockPermissionService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockPermissionService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

import { Test, TestingModule } from '@nestjs/testing'
import { ActionController } from '../../../src/modules/action/action.controller'
import { ActionService } from '../../../src/modules/action/action.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockActionService = {
	findMany: jest.fn(),
	findOne: jest.fn(),
	updateOne: jest.fn(),
}

describe('ActionController', () => {
	let controller: ActionController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ActionController],
			providers: [{ provide: ActionService, useValue: mockActionService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<ActionController>(ActionController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /action/many)', () => {
		it("barcha actionlarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { actions: [], total: 0 } }
			mockActionService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockActionService.findMany).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('findOne (GET /action/one)', () => {
		it("bitta actionni qaytarishi kerak", async () => {
			const query = { id: 'action-id-1' } as any
			const mockResult = { data: { id: 'action-id-1', method: 'POST', path: '/test' } }
			mockActionService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockActionService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /action/one)', () => {
		it("actionni yangilashi kerak", async () => {
			const query = { id: 'action-id-1' } as any
			const body = { isActive: true } as any
			const mockResult = { data: { id: 'action-id-1' } }
			mockActionService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockActionService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})
})

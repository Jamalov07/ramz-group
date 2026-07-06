import { Test, TestingModule } from '@nestjs/testing'
import { CommonController } from '../../../src/modules/common/common.controller'
import { CommonService } from '../../../src/modules/common/common.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockCommonService = {
	createDayClose: jest.fn(),
	getDayClose: jest.fn(),
}

describe('CommonController', () => {
	let controller: CommonController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CommonController],
			providers: [{ provide: CommonService, useValue: mockCommonService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<CommonController>(CommonController)
		jest.clearAllMocks()
	})

	describe('createDayClose (POST /common/day-close)', () => {
		it("kunni yopish yozuvini yaratishi kerak", async () => {
			const mockResult = { data: { id: 'day-close-id-1', createdAt: new Date() } }
			mockCommonService.createDayClose.mockResolvedValue(mockResult)

			const result = await controller.createDayClose()

			expect(mockCommonService.createDayClose).toHaveBeenCalled()
			expect(result).toEqual(mockResult)
		})
	})

	describe('getDayClose (GET /common/day-close)', () => {
		it("kunni yopish ma'lumotini qaytarishi kerak", async () => {
			const query = { date: '2024-01-01' } as any
			const mockResult = { data: { id: 'day-close-id-1', date: '2024-01-01' } }
			mockCommonService.getDayClose.mockResolvedValue(mockResult)

			const result = await controller.getDayClose(query)

			expect(mockCommonService.getDayClose).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

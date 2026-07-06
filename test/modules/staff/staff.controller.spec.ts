import { Test, TestingModule } from '@nestjs/testing'
import { StaffController } from '../../../src/modules/staff/staff.controller'
import { StaffService } from '../../../src/modules/staff/staff.service'
import { CheckPermissionGuard } from '../../../src/common'

const mockStaffService = {
	findMany: jest.fn(),
	findOne: jest.fn(),
	createOne: jest.fn(),
	updateOne: jest.fn(),
	deleteOne: jest.fn(),
}

describe('StaffController', () => {
	let controller: StaffController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StaffController],
			providers: [{ provide: StaffService, useValue: mockStaffService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<StaffController>(StaffController)
		jest.clearAllMocks()
	})

	describe('findMany (GET /staff/many)', () => {
		it("barcha xodimlarni qaytarishi kerak", async () => {
			const query = { page: 1, pageSize: 10 } as any
			const mockResult = { data: { staffs: [], total: 0 } }
			mockStaffService.findMany.mockResolvedValue(mockResult)

			const result = await controller.findMany(query)

			expect(mockStaffService.findMany).toHaveBeenCalledWith({ ...query, isDeleted: false })
			expect(result).toEqual(mockResult)
		})
	})

	describe('findOne (GET /staff/one)', () => {
		it("bitta xodimni qaytarishi kerak", async () => {
			const query = { id: 'staff-id-1' } as any
			const mockResult = { data: { id: 'staff-id-1', fullName: 'Test Staff' } }
			mockStaffService.findOne.mockResolvedValue(mockResult)

			const result = await controller.findOne(query)

			expect(mockStaffService.findOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('createOne (POST /staff/one)', () => {
		it("yangi xodim yaratishi kerak", async () => {
			const body = { fullName: 'Yangi Xodim', phone: '+998901234567', password: 'pass123', type: 'CASHIER' } as any
			const mockResult = { data: { id: 'staff-id-1' } }
			mockStaffService.createOne.mockResolvedValue(mockResult)

			const result = await controller.createOne(body)

			expect(mockStaffService.createOne).toHaveBeenCalledWith(body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('updateOne (PATCH /staff/one)', () => {
		it("xodimni yangilashi kerak", async () => {
			const query = { id: 'staff-id-1' } as any
			const body = { fullName: 'Updated Name' } as any
			const mockResult = { data: { id: 'staff-id-1' } }
			mockStaffService.updateOne.mockResolvedValue(mockResult)

			const result = await controller.updateOne(query, body)

			expect(mockStaffService.updateOne).toHaveBeenCalledWith(query, body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('deleteOne (DELETE /staff/one)', () => {
		it("xodimni o'chirishi kerak", async () => {
			const query = { id: 'staff-id-1' } as any
			const mockResult = { data: null }
			mockStaffService.deleteOne.mockResolvedValue(mockResult)

			const result = await controller.deleteOne(query)

			expect(mockStaffService.deleteOne).toHaveBeenCalledWith(query)
			expect(result).toEqual(mockResult)
		})
	})
})

import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../../../src/modules/auth/auth.controller'
import { AuthService } from '../../../src/modules/auth/auth.service'
import { CheckPermissionGuard, RefreshTokenInterceptor } from '../../../src/common'

const mockAuthService = {
	getStaffProfile: jest.fn(),
	signIn: jest.fn(),
	signOut: jest.fn(),
	getValidTokens: jest.fn(),
}

const mockRefreshTokenInterceptor = {
	intercept: jest.fn((context, next) => next.handle()),
}

const mockRequest = {
	user: { id: 'staff-id-1', token: 'refresh-token-mock' },
} as any

describe('AuthController', () => {
	let controller: AuthController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthService, useValue: mockAuthService }],
		})
			.overrideGuard(CheckPermissionGuard)
			.useValue({ canActivate: () => true })
			.overrideInterceptor(RefreshTokenInterceptor)
			.useValue(mockRefreshTokenInterceptor)
			.compile()

		controller = module.get<AuthController>(AuthController)
		jest.clearAllMocks()
	})

	describe('getStaffProfile (GET /auth/profile)', () => {
		it("xodim profilini qaytarishi kerak", async () => {
			const mockResult = { data: { id: 'staff-id-1', fullName: 'Test Staff' } }
			mockAuthService.getStaffProfile.mockResolvedValue(mockResult)

			const result = await controller.getStaffProfile(mockRequest)

			expect(mockAuthService.getStaffProfile).toHaveBeenCalledWith({ user: mockRequest.user })
			expect(result).toEqual(mockResult)
		})
	})

	describe('signIn (POST /auth/sign-in)', () => {
		it("to'g'ri ma'lumotlar bilan kirishi kerak", async () => {
			const body = { phone: '+998901234567', password: 'password123' }
			const mockResult = { data: { staff: { id: 'staff-id-1' }, tokens: { accessToken: 'at', refreshToken: 'rt' } } }
			mockAuthService.signIn.mockResolvedValue(mockResult)

			const result = await controller.signIn(body as any)

			expect(mockAuthService.signIn).toHaveBeenCalledWith(body)
			expect(result).toEqual(mockResult)
		})
	})

	describe('signOut (POST /auth/sign-out)', () => {
		it("tizimdan chiqishi kerak", async () => {
			const mockResult = { data: null, success: { messages: ['sign out success'] } }
			mockAuthService.signOut.mockResolvedValue(mockResult)

			const result = await controller.signOut(mockRequest)

			expect(mockAuthService.signOut).toHaveBeenCalledWith({ user: mockRequest.user })
			expect(result).toEqual(mockResult)
		})
	})

	describe('getValidTokensWithRefresh (POST /auth/refresh-token)', () => {
		it("yangi tokenlar olishi kerak", async () => {
			const mockResult = { data: { staff: { id: 'staff-id-1' }, tokens: { accessToken: 'new-at', refreshToken: 'new-rt' } } }
			mockAuthService.getValidTokens.mockResolvedValue(mockResult)

			const result = await controller.getValidTokensWithRefresh(mockRequest)

			expect(mockAuthService.getValidTokens).toHaveBeenCalledWith({ user: mockRequest.user })
			expect(result).toEqual(mockResult)
		})
	})
})

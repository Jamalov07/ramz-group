import { Test, TestingModule } from '@nestjs/testing'
import { UploadController } from '../../../src/modules/upload/upload.controller'
import { UploadService } from '../../../src/modules/upload/upload.service'

const mockUploadService = {
	uploadStaff: jest.fn(),
	uploadSupplier: jest.fn(),
	uploadClient: jest.fn(),
	uploadProduct: jest.fn(),
}

const mockFile = {
	fieldname: 'file',
	originalname: 'test.xlsx',
	encoding: '7bit',
	mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	buffer: Buffer.from('test'),
	size: 1024,
} as Express.Multer.File

describe('UploadController', () => {
	let controller: UploadController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UploadController],
			providers: [{ provide: UploadService, useValue: mockUploadService }],
		}).compile()

		controller = module.get<UploadController>(UploadController)
		jest.clearAllMocks()
	})

	describe('uploadStaff (POST /upload/staff)', () => {
		it("xodimlar excel faylini yuklashi kerak", async () => {
			const query = { shopId: 'shop-id-1' } as any
			const mockResult = { data: { created: 5, updated: 2 } }
			mockUploadService.uploadStaff.mockResolvedValue(mockResult)

			const result = await controller.uploadStaff(mockFile, query)

			expect(mockUploadService.uploadStaff).toHaveBeenCalledWith(mockFile, query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('uploadSupplier (POST /upload/supplier)', () => {
		it("ta'minotchilar excel faylini yuklashi kerak", async () => {
			const query = { shopId: 'shop-id-1' } as any
			const mockResult = { data: { created: 3, updated: 1 } }
			mockUploadService.uploadSupplier.mockResolvedValue(mockResult)

			const result = await controller.uploadSupplier(mockFile, query)

			expect(mockUploadService.uploadSupplier).toHaveBeenCalledWith(mockFile, query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('uploadClient (POST /upload/client)', () => {
		it("mijozlar excel faylini yuklashi kerak", async () => {
			const query = { shopId: 'shop-id-1' } as any
			const mockResult = { data: { created: 10, updated: 4 } }
			mockUploadService.uploadClient.mockResolvedValue(mockResult)

			const result = await controller.uploadClient(mockFile, query)

			expect(mockUploadService.uploadClient).toHaveBeenCalledWith(mockFile, query)
			expect(result).toEqual(mockResult)
		})
	})

	describe('uploadProduct (POST /upload/product)', () => {
		it("mahsulotlar excel faylini yuklashi kerak", async () => {
			const query = { shopId: 'shop-id-1' } as any
			const mockResult = { data: { created: 20, updated: 5 } }
			mockUploadService.uploadProduct.mockResolvedValue(mockResult)

			const result = await controller.uploadProduct(mockFile, query)

			expect(mockUploadService.uploadProduct).toHaveBeenCalledWith(mockFile, query)
			expect(result).toEqual(mockResult)
		})
	})
})

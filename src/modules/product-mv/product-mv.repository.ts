import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared/prisma'
import {
	ArrivalProductMVCreateOneRequest,
	ArrivalProductMVUpdateOneRequest,
	ProductMVDeleteOneRequest,
	ProductMVFindManyRequest,
	ProductMVFindOneRequest,
	ProductMVGetManyRequest,
	ProductMVGetOneRequest,
	ReturningProductMVCreateOneRequest,
	ReturningProductMVUpdateOneRequest,
	SellingProductMVCreateOneRequest,
	SellingProductMVUpdateOneRequest,
} from './interfaces'
import { ProductMVController } from './product-mv.controller'
import { SellingStatusEnum, ServiceTypeEnum } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class ProductMVRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findMany(query: ProductMVFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const productMVs = await this.prisma.productMVModel.findMany({
			select: {
				id: true,
				price: true,
				cost: true,
				count: true,
				product: { select: { id: true, name: true, createdAt: true } },
				totalCost: true,
				totalPrice: true,
				type: true,
				selling: {
					select: { publicId: true, id: true, createdAt: true, date: true, status: true, client: { select: { id: true, fullname: true, phone: true, createdAt: true } } },
				},
				arrival: { select: { id: true, date: true, supplier: { select: { id: true, fullname: true, phone: true, createdAt: true } } } },
				returning: { select: { id: true, date: true, client: { select: { id: true, fullname: true, phone: true, createdAt: true } } } },
				createdAt: true,
				staff: { select: { id: true, fullname: true } },
			},
			where: {
				sellingId: query.sellingId,
				arrivalId: query.arrivalId,
				productId: query.productId,
				returningId: query.returningId,
				staffId: query.staffId,
				type: query.type,
			},
			orderBy: [{ createdAt: 'asc' }],
			...paginationOptions,
		})

		return productMVs
	}

	async findManyForStats(query: ProductMVFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const productMVs = await this.prisma.productMVModel.findMany({
			select: {
				id: true,
				price: true,
				cost: true,
				count: true,
				product: { select: { id: true, name: true, createdAt: true } },
				totalCost: true,
				totalPrice: true,
				type: true,
				selling: {
					select: { publicId: true, id: true, createdAt: true, date: true, status: true, client: { select: { id: true, fullname: true, phone: true, createdAt: true } } },
				},
				arrival: { select: { id: true, date: true, supplier: { select: { id: true, fullname: true, phone: true, createdAt: true } } } },
				returning: { select: { id: true, date: true, client: { select: { id: true, fullname: true, phone: true, createdAt: true } } } },
				createdAt: true,
				staff: { select: { id: true, fullname: true } },
			},
			where: {
				createdAt: { gte: query.startDate, lte: query.endDate },
				OR: [
					{
						type: ServiceTypeEnum.arrival,
					},
					{
						type: ServiceTypeEnum.selling,
						selling: { status: SellingStatusEnum.accepted },
					},
					{
						type: ServiceTypeEnum.returning,
						returning: { status: SellingStatusEnum.accepted },
					},
				],
				// type: query.type,
				// sellingId: query.sellingId,
				// arrivalId: query.arrivalId,
				// returningId: query.returningId,
				productId: query.productId,
				staffId: query.staffId,
			},
			orderBy: [{ createdAt: 'asc' }],
			...paginationOptions,
		})

		return productMVs
	}

	async findOne(query: ProductMVFindOneRequest) {
		const product = await this.prisma.productMVModel.findFirst({
			where: { id: query.id },
		})

		return product
	}

	async countFindMany(query: ProductMVFindManyRequest) {
		const productMVsCount = await this.prisma.productMVModel.count({
			where: {
				sellingId: query.sellingId,
				arrivalId: query.arrivalId,
				productId: query.productId,
				returningId: query.returningId,
				staffId: query.staffId,
				type: query.type,
			},
		})

		return productMVsCount
	}

	async getMany(query: ProductMVGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const productMVs = await this.prisma.productMVModel.findMany({
			where: {
				sellingId: query.sellingId,
				arrivalId: query.arrivalId,
				productId: query.productId,
				returningId: query.returningId,
				staffId: query.staffId,
				type: query.type,
			},
			...paginationOptions,
		})

		return productMVs
	}

	async getOne(query: ProductMVGetOneRequest) {
		const product = await this.prisma.productMVModel.findFirst({
			where: {
				id: query.id,
				sellingId: query.sellingId,
				arrivalId: query.arrivalId,
				productId: query.productId,
				returningId: query.returningId,
				staffId: query.staffId,
				type: query.type,
			},
			select: {
				totalCost: true,
				totalPrice: true,
				selling: true,
				arrival: {
					select: {
						date: true,
						createdAt: true,
						id: true,
						payment: true,
						products: true,
						staff: true,
						updatedAt: true,
						staffId: true,
						supplier: true,
						supplierId: true,
						totalCost: true,
						totalPrice: true,
					},
				},
				returning: true,
				type: true,
				product: true,
				price: true,
				count: true,
				cost: true,
				id: true,
			},
		})

		return product
	}

	async countGetMany(query: ProductMVGetManyRequest) {
		const productMVsCount = await this.prisma.productMVModel.count({
			where: {
				sellingId: query.sellingId,
				arrivalId: query.arrivalId,
				productId: query.productId,
				returningId: query.returningId,
				staffId: query.staffId,
				type: query.type,
			},
		})

		return productMVsCount
	}

	async createOneSelling(body: SellingProductMVCreateOneRequest) {
		const product = await this.prisma.productMVModel.create({
			data: {
				totalPrice: body.totalPrice,
				count: body.count,
				price: body.price,
				sellingId: body.sellingId,
				type: ServiceTypeEnum.selling,
				productId: body.productId,
				staffId: body.staffId,
			},
			select: {
				id: true,
				totalPrice: true,
				createdAt: true,
				selling: {
					select: {
						id: true,
						totalPrice: true,
						status: true,
						publicId: true,
						createdAt: true,
						date: true,
						client: { select: { fullname: true, phone: true, id: true, createdAt: true, telegram: true } },
						staff: { select: { fullname: true, phone: true, id: true, createdAt: true } },
						payment: { select: { id: true, card: true, cash: true, other: true, transfer: true, description: true, total: true } },
						products: { select: { createdAt: true, id: true, price: true, count: true, product: { select: { name: true, id: true, createdAt: true } } } },
					},
				},
				cost: true,
				count: true,
				price: true,
				product: true,
			},
		})

		if (product.selling.status === SellingStatusEnum.accepted) {
			await this.prisma.productModel.update({ where: { id: product.product.id }, data: { count: { decrement: product.count } } })
		}

		return product
	}

	async createOneArrival(body: ArrivalProductMVCreateOneRequest) {
		const product = await this.prisma.productMVModel.create({
			data: {
				count: body.count,
				price: body.price,
				cost: body.cost,
				totalCost: body.totalCost,
				totalPrice: body.totalPrice,
				arrivalId: body.arrivalId,
				type: ServiceTypeEnum.arrival,
				productId: body.productId,
				staffId: body.staffId,
			},
			select: {
				product: true,
				cost: true,
				count: true,
				price: true,
				totalCost: true,
				totalPrice: true,
				arrival: {
					select: {
						date: true,
						createdAt: true,
						id: true,
						payment: true,
						products: true,
						staff: true,
						updatedAt: true,
						staffId: true,
						supplier: true,
						supplierId: true,
						totalCost: true,
						totalPrice: true,
					},
				},
			},
		})

		await this.prisma.productModel.update({ where: { id: product.product.id }, data: { count: { increment: product.count }, price: product.price, cost: product.cost } })

		return product
	}

	async createOneReturning(body: ReturningProductMVCreateOneRequest) {
		const product = await this.prisma.productMVModel.create({
			data: {
				count: body.count,
				price: body.price,
				returningId: body.returningId,
				type: ServiceTypeEnum.returning,
				productId: body.productId,
				staffId: body.staffId,
				totalPrice: body.totalPrice,
			},
			select: { returning: true, product: true, count: true, totalPrice: true },
		})

		if (product.returning.status === SellingStatusEnum.accepted) {
			await this.prisma.productModel.update({ where: { id: product.product.id }, data: { count: { increment: product.count } } })
		}

		return product
	}

	async updateOneSelling(query: ProductMVGetOneRequest, body: SellingProductMVUpdateOneRequest) {
		const pr = await this.getOne({ id: query.id })

		const product = await this.prisma.productMVModel.update({
			where: { id: query.id },
			data: {
				count: body.count,
				price: body.price,
				totalPrice: body.totalPrice,
				productId: body.productId,
				sellingId: body.sellingId,
			},
			select: {
				id: true,
				totalPrice: true,
				selling: {
					select: {
						id: true,
						totalPrice: true,
						status: true,
						publicId: true,
						updatedAt: true,
						createdAt: true,
						deletedAt: true,
						date: true,
						client: { select: { fullname: true, phone: true, id: true, createdAt: true, telegram: true } },
						staff: { select: { fullname: true, phone: true, id: true, createdAt: true } },
						payment: { select: { total: true, id: true, card: true, cash: true, other: true, transfer: true, description: true } },
						products: { select: { createdAt: true, id: true, price: true, count: true, product: { select: { name: true, id: true, createdAt: true } } } },
					},
				},
				cost: true,
				count: true,
				price: true,
				product: true,
			},
		})

		if (product.selling.status === SellingStatusEnum.accepted) {
			await this.prisma.productModel.update({
				where: { id: product.product.id },
				data: { count: { increment: pr.count - product.count } },
			})
		}

		return product
	}

	/** Selling totalPrice/totalDiscountPrice ni mahsulotlardan qayta hisoblaydi (increment/race o‘rniga). */
	async recalculateSellingTotalPrice(sellingId: string): Promise<Decimal> {
		return this.prisma.$transaction(async (tx) => {
			// Parallel product add paytida lost-update bo‘lmasligi uchun qatorni qulflash
			await tx.$queryRawUnsafe(`SELECT id FROM selling WHERE id = $1::uuid FOR UPDATE`, sellingId)

			const selling = await tx.sellingModel.findFirst({
				where: { id: sellingId },
				select: {
					discount: true,
					products: { select: { price: true, count: true } },
				},
			})
			if (!selling) return new Decimal(0)

			const totalPrice = selling.products.reduce((acc, p) => acc.plus(p.price.mul(p.count)), new Decimal(0))
			const discount = selling.discount ?? new Decimal(0)
			const totalDiscountPrice = totalPrice.mul(new Decimal(100).minus(discount)).div(100)

			await tx.sellingModel.update({
				where: { id: sellingId },
				data: { totalPrice, totalDiscountPrice },
			})

			return totalPrice
		})
	}

	/** @deprecated use recalculateSellingTotalPrice */
	async updateSellingTotalPrice(id: string, _totalPrice: Decimal) {
		return this.recalculateSellingTotalPrice(id)
	}

	async updateOneArrival(query: ProductMVGetOneRequest, body: ArrivalProductMVUpdateOneRequest) {
		const pr = await this.getOne({ id: query.id })

		const product = await this.prisma.productMVModel.update({
			where: { id: query.id },
			data: {
				count: body.count,
				price: body.price,
				cost: body.cost,
				totalCost: body.totalCost,
				totalPrice: body.totalPrice,
				productId: body.productId,
				arrivalId: body.arrivalId,
			},
			select: { arrival: true, product: true, cost: true, count: true, price: true },
		})

		await this.prisma.productModel.update({
			where: { id: product.product.id },
			data: {
				cost: product.cost,
				price: product.price,
				count: { increment: product.count - pr.count },
			},
		})

		return product
	}

	async updateOneReturning(query: ProductMVGetOneRequest, body: ReturningProductMVUpdateOneRequest) {
		const pr = await this.getOne({ id: query.id })

		const product = await this.prisma.productMVModel.update({
			where: { id: query.id },
			data: {
				count: body.count,
				price: body.price,
				totalPrice: body.totalPrice,
				productId: body.productId,
				returningId: body.returningId,
			},
			select: { returning: true, product: true, count: true },
		})

		if (product.returning.status === SellingStatusEnum.accepted) {
			await this.prisma.productModel.update({
				where: { id: product.product.id },
				data: { count: { increment: product.count - pr.count } },
			})
		}

		return product
	}

	async deleteOne(query: ProductMVDeleteOneRequest) {
		const product = await this.prisma.productMVModel.delete({
			where: { id: query.id },
			select: {
				id: true,
				type: true,
				returning: { select: { id: true, totalPrice: true, discount: true, status: true } },
				arrival: true,
				selling: {
					select: {
						id: true,
						totalPrice: true,
						discount: true,
						status: true,
						publicId: true,
						updatedAt: true,
						createdAt: true,
						deletedAt: true,
						date: true,
						client: { select: { fullname: true, phone: true, id: true, createdAt: true, telegram: true } },
						staff: { select: { fullname: true, phone: true, id: true, createdAt: true } },
						payment: { select: { total: true, id: true, card: true, cash: true, other: true, transfer: true, description: true } },
						products: { select: { createdAt: true, id: true, price: true, count: true, product: { select: { name: true, id: true, createdAt: true } } } },
					},
				},
				cost: true,
				count: true,
				price: true,
				product: true,
			},
		})

		if (product.type === ServiceTypeEnum.selling) {
			await this.recalculateSellingTotalPrice(product.selling.id)
			if (product.selling && product.selling.status === SellingStatusEnum.accepted) {
				await this.prisma.productModel.update({ where: { id: product.product.id }, data: { count: { increment: product.count } } })
			}
		} else if (product.type === ServiceTypeEnum.arrival) {
			const totalCost = product.arrival.totalCost.minus(product.cost.mul(product.count))
			const totalPrice = product.arrival.totalPrice.minus(product.price.mul(product.count))
			await this.prisma.arrivalModel.update({ where: { id: product.arrival.id }, data: { totalCost: totalCost, totalPrice: totalPrice } })
			await this.prisma.productModel.update({ where: { id: product.product.id }, data: { count: { decrement: product.count } } })
		} else if (product.type === ServiceTypeEnum.returning) {
			const totalPrice = product.returning.totalPrice.minus(product.price.mul(product.count))
			const returningDiscount = product.returning.discount ?? new Decimal(0)
			const totalDiscountPrice = totalPrice.mul(new Decimal(100).minus(returningDiscount)).div(100)
			await this.prisma.returningModel.update({ where: { id: product.returning.id }, data: { totalPrice: totalPrice, totalDiscountPrice: totalDiscountPrice } })
			if (product.returning && product.returning.status === SellingStatusEnum.accepted) {
				await this.prisma.productModel.update({ where: { id: product.product.id }, data: { count: { increment: product.count } } })
			}
		}

		return product
	}

	async updateArrivalPriceAndCost(id: string, price: Decimal, cost: Decimal) {
		await this.prisma.arrivalModel.update({ where: { id: id }, data: { totalPrice: price, totalCost: cost } })
	}

	async onModuleInit() {
		// await this.prisma.createActionMethods(ProductMVController)
	}
}

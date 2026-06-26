import { Injectable } from '@nestjs/common'
import { Decimal } from '@prisma/client/runtime/library'
import { PrismaService } from '../shared'
import {
	CurrencyCreateOneRequest,
	CurrencyDeleteOneRequest,
	CurrencyFindManyRequest,
	CurrencyFindOneRequest,
	CurrencyFindOneData,
	CurrencyGetManyRequest,
	CurrencyGetOneRequest,
	CurrencyUpdateOneRequest,
} from './interfaces'

/** Valyuta ma'lumotlari kamdan-kam o'zgaradi — 60 soniyalik TTL kesh juda ko'p DB round-tripni kamaytiradi */
const CACHE_TTL_MS = 60_000

interface CacheEntry<T> {
	value: T
	expiresAt: number
}

@Injectable()
export class CurrencyRepository {
	private readonly prisma: PrismaService
	private readonly _cache = new Map<string, CacheEntry<unknown>>()

	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: CurrencyFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		let nameFilter: any = {}
		if (query.search) {
			const searchWords = query.search?.split(/\s+/).filter(Boolean) ?? []

			nameFilter = {
				[searchWords.length > 1 ? 'AND' : 'OR']: searchWords.map((word) => ({
					name: {
						contains: word,
						mode: 'insensitive',
					},
				})),
			}
		}

		const currencies = await this.prisma.currencyModel.findMany({
			where: {
				...nameFilter,
				symbol: query.symbol,
				isActive: query.isActive,
				deletedAt: null,
			},
			select: {
				id: true,
				name: true,
				symbol: true,
				isActive: true,
				exchangeRate: true,
				createdAt: true,
			},
			...paginationOptions,
		})

		return currencies
	}

	async countFindMany(query: CurrencyFindManyRequest) {
		let nameFilter: any = {}
		if (query.search) {
			const searchWords = query.search?.split(/\s+/).filter(Boolean) ?? []

			nameFilter = {
				[searchWords.length > 1 ? 'AND' : 'OR']: searchWords.map((word) => ({
					name: {
						contains: word,
						mode: 'insensitive',
					},
				})),
			}
		}

		const currenciesCount = await this.prisma.currencyModel.count({
			where: {
				...nameFilter,
				symbol: query.symbol,
				isActive: query.isActive,
			},
		})

		return currenciesCount
	}

	async findOne(query: CurrencyFindOneRequest) {
		const currency = await this.prisma.currencyModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				name: true,
				symbol: true,
				isActive: true,
				exchangeRate: true,
				createdAt: true,
			},
		})

		return currency
	}

	async getMany(query: CurrencyGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const currencies = await this.prisma.currencyModel.findMany({
			where: { id: { in: query.ids }, name: query.name, symbol: query.symbol, isActive: query.isActive },
			...paginationOptions,
		})

		return currencies
	}

	async countGetMany(query: CurrencyGetManyRequest) {
		const currenciesCount = await this.prisma.currencyModel.count({
			where: { id: { in: query.ids }, name: query.name, symbol: query.symbol, isActive: query.isActive },
		})

		return currenciesCount
	}

	async getOne(query: CurrencyGetOneRequest) {
		const currency = await this.prisma.currencyModel.findFirst({
			where: { id: query.id, name: query.name, symbol: query.symbol, isActive: query.isActive },
		})

		return currency
	}

	async createOne(body: CurrencyCreateOneRequest) {
		const currency = await this.prisma.currencyModel.create({
			data: {
				name: body.name,
				symbol: body.symbol,
				exchangeRate: body.exchangeRate,
				isActive: body.isActive,
			},
		})
		return currency
	}

	async updateOne(query: CurrencyGetOneRequest, body: CurrencyUpdateOneRequest) {
		const currency = await this.prisma.currencyModel.update({
			where: { id: query.id },
			data: {
				name: body.name,
				symbol: body.symbol,
				exchangeRate: body.exchangeRate,
				isActive: body.isActive,
			},
		})
		return currency
	}

	async deleteOne(query: CurrencyDeleteOneRequest) {
		const currency = await this.prisma.currencyModel.update({
			where: { id: query.id },
			data: { deletedAt: new Date() },
		})
		return currency
	}
}

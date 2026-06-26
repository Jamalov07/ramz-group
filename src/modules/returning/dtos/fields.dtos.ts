import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto, IsDecimalIntOrBigInt } from '../../../common'
import { ReturningOptional, ReturningRequired } from '../interfaces'
import { IsDateString, IsNotEmpty, IsOptional, IsUUID, Max } from 'class-validator'
import { Decimal } from '@prisma/client/runtime/library'
import { $Enums } from '@prisma/client'

export class ReturningRequiredDto extends DefaultRequiredFieldsDto implements ReturningRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	clientId: string

	@ApiProperty({ type: Date })
	@IsNotEmpty()
	@IsDateString()
	date: Date

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	staffId: string

	discount: Decimal
	totalPrice: Decimal
	totalDiscountPrice: Decimal
	status: $Enums.SellingStatusEnum
}

export class ReturningOptionalDto extends DefaultOptionalFieldsDto implements ReturningOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	clientId?: string

	@ApiPropertyOptional({ type: Date })
	@IsOptional()
	@IsDateString()
	date?: Date

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	staffId?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsDecimalIntOrBigInt()
	@Max(100)
	discount?: Decimal

	totalPrice?: Decimal
	totalDiscountPrice?: Decimal
}

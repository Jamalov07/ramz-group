import { Decimal } from '@prisma/client/runtime/library'

/** Bot caption / PDF uchun summani 2 xonaga yaxlitlab string qiladi (float artifactlar: -1e-14, 66.49000…). */
export function formatMoney(value: Decimal | number | null | undefined): string {
	if (value == null) return '0.00'
	const d = value instanceof Decimal ? value : new Decimal(value)
	const rounded = d.toDecimalPlaces(2)
	if (rounded.isZero()) return '0.00'
	return rounded.toFixed(2)
}

import { ApiProperty, ApiPropertyOptional, IntersectionType, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

const LimitDefaultValue = 10;
const OffsetDefaultValue = 0;

export class OffsetBased {
  @ApiPropertyOptional({ default: LimitDefaultValue })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  limit: number = LimitDefaultValue;

  @ApiPropertyOptional({ default: OffsetDefaultValue })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = OffsetDefaultValue;
}

export class PaginationDto extends OffsetBased {
  @ApiProperty({ default: 0 })
  page!: number;

  @ApiProperty({ default: 0 })
  totalCount!: number;

  @ApiProperty({ default: 0 })
  totalPages!: number;

  @ApiProperty({ default: false })
  hasNext!: boolean;

  @ApiProperty({ default: false })
  hasPrevious!: boolean;
}

export class PageInfo extends IntersectionType(
  OffsetBased,
  PickType(PaginationDto, ['totalCount']),
) {}

export function getPaginationDto({
  offset = 0,
  limit = 10,
  totalCount = 0,
}: PageInfo): PaginationDto {
  return {
    offset,
    limit,
    page: offset / limit + 1,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    hasNext: offset + limit < totalCount,
    hasPrevious: offset > 0,
  };
}

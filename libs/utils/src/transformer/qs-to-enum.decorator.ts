import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional, ApiPropertyOptions } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsEnum } from "class-validator";
import { collectQSToArray } from "./qs-to-array.decorator";
import { truthy } from "../functions";

export function QSToEnum(enumType: object, options: ApiPropertyOptions) {
  const isArray = options?.isArray ?? false;
  const required = options?.required ?? false;
  const nullable = options?.nullable ?? false;

  const decorators = [
    (required ? ApiProperty : ApiPropertyOptional)({
      type: enumType,
      enum: enumType,
      isArray,
      nullable,
      required,
    }),
    isArray && Transform(collectQSToArray),
    isArray && IsArray(),
    IsEnum(enumType, { each: isArray }),
  ].filter(truthy);

  return applyDecorators(...decorators);
}
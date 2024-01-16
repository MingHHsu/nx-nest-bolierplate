import { applyDecorators } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional, ApiPropertyOptions } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray } from "class-validator";

export function collectQSToArray({ value }: { value: string | string[] }) {
  const collection = Array.isArray(value) ? value : [value];

  return collection.reduce<string[]>((result, item) =>
    result.concat(item.trim() ? [item.trim()] : []), []);
}

export function QSToArray(options: Omit<ApiPropertyOptions, 'isArray'>) {
  const required = options?.required ?? false;
  const nullable = options?.nullable ?? false;
  return applyDecorators(
    (required ? ApiProperty : ApiPropertyOptional)({
      type: String,
      isArray: true,
      nullable,
      required,
    }),
    Transform(collectQSToArray),
    IsArray(),
  );
}
import { PageInfo, getPaginationDto } from "./pagination";

export function wrapResponse<DataType>(data: DataType, pageInfo?: PageInfo) {
  const pagination = pageInfo ? getPaginationDto(pageInfo) :  null;

  return {
    data,
    pagination,
  };
}
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ApiNotFoundResponse } from "@nestjs/swagger";

type ResourceErrorMessage = {
  resourceName: string;
  references: Record<string, unknown> | Record<string, unknown>[];
  message?: string;
};

@ApiNotFoundResponse({ type: 'ResourceNotFoundException', description: 'Resource not found' })
export class ResourceNotFoundException extends NotFoundException {
  constructor(errorMessage: ResourceErrorMessage) {
    super(errorMessage);
  }
}

export class DuplicatedResourceException extends BadRequestException {
  constructor(errorMessage: ResourceErrorMessage) {
    super(errorMessage);
  }
}
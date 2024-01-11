import { BadRequestException, NotFoundException } from "@nestjs/common";

type ResourceErrorMessage = {
  resourceName: string;
  references: Record<string, unknown> | Record<string, unknown>[];
  message?: string;
};

export class ResourceNotFoundException extends NotFoundException {
  constructor(errorMessage: ResourceErrorMessage) {
    super(Object.assign({ title: 'Resource not found'}, errorMessage));
  }
}

export class DuplicatedResourceException extends BadRequestException {
  constructor(errorMessage: ResourceErrorMessage) {
    super(Object.assign({ title: 'Duplicated resource' }, errorMessage));
  }
}
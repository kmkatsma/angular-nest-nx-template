export enum ValidationMessageEnum {
  MissingAndRequired = 'Missing and Required',
  Invalid = 'Invalid'
}

export const YesNoNull = ['y', 'Y', 'N', 'n', null, undefined, ''];

export class ValidationResult {
  source: string;
  message: string;
}

export class ValidationResults {
  messages: ValidationResult[] = [];

  addMessage(source: string, message: string) {
    const result = new ValidationResult();
    result.message = message;
    result.source = source;
    this.messages.push(result);
  }
}

export class ValidationStatus {
  errorCount = 0;
  valid = true;
  messages: ValidationResult[] = [];

  constructor(messages?: ValidationResult[]) {
    if (messages && messages.length > 0) {
      this.valid = false;
      this.errorCount = messages.length;
      this.messages = messages;
    } else {
      this.valid = true;
      this.errorCount = 0;
      this.messages = [];
    }
  }
}

export type ModelValidateMethod = <T>(
  typeInstance: T,
  request: T
) => Promise<T>;

export interface ModelValidationConfig {
  typedInstance: any;
}

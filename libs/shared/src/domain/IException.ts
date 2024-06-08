export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

export interface IException {
  badReqeustException(data: IFormatExceptionMessage): void;
  internalServerException(data: IFormatExceptionMessage): void;
  forbiddenException(data: IFormatExceptionMessage): void;
  unauthorizedException(data: IFormatExceptionMessage): void;
  notfoundException(data: IFormatExceptionMessage): void;
}

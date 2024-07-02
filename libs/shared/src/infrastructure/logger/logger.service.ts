import { ILogger } from '@app/shared/domain/ILogger';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  error(message: any, context: string, trace?: string): void {
    super.error(`[ERROR] ${message}`, trace, context);
  }
  log(message: any, context: string): void {
    super.log(`[INFO] ${message}`, context);
  }
  debug(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }

  warn(message: any, context?: string): void {
    super.log(`[WARN] ${message}`, context);
  }

  verbose(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[VERBOSE] ${message}`, context);
    }
  }
}

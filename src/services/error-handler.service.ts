import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EclesialNotificationService } from './eclesial-notification.service';

@Injectable()
export class ErrorHandlerService {
  constructor(
    private _eclesialNotificationService: EclesialNotificationService
  ) {}

  handle(error: HttpErrorResponse) {
    let message = '';
    switch (error.status) {
      case 500:
        if (error.error.errorDescription) {
          message = `${error.error.errorDescription}`;
        } else if (error.error.error_description) {
          message = `${error.error.error_description}`;
        } else {
          message = error.message || error.error.title;
        }
        this._eclesialNotificationService.notifyError(message);
        break;
      case 400:
        if (error.error instanceof Blob) {
          const READER = new FileReader();
          READER.addEventListener('loadend', (e) => {
            const { notifications } = JSON.parse(e.srcElement['result']);
            notifications.forEach((notification) =>
              this._eclesialNotificationService.notifyWarning(notification)
            );
          });
          READER.readAsText(error.error);
          break;
        }

        if (error.error.notifications) {
          for (let message in error.error.notifications) {
            setTimeout(() => {
              this._eclesialNotificationService.notifyWarning(
                error.error.notifications[message]
              );
            }, 700);
          }
          break;
        }
      case 403:
        if (error.error.errorDescription) {
          message = `${error.error.errorDescription}`;
        } else if (error.error.error_description) {
          message = `${error.error.error_description}`;
        } else {
          message = error.message;
        }
        this._eclesialNotificationService.notifyError(message);
        break;
      case 404:
      case 405:
        this._eclesialNotificationService.notifyError(
          'Houve um problema de conexão com o servidor, estamos trabalhando nisso!'
        );
        break;
      default:
        break;
    }
  }
}

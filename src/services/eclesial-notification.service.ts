import { Injectable } from '@angular/core';
import { SnotifyService } from './snotify-service.stub';

@Injectable()
export class EclesialNotificationService {
  private message: string = null;
  private time: number = null;
  private type: notificationEnum = null;

  constructor(private snotifyService: SnotifyService) {}

  private snotifyNotifications: number[] = [];

  public notifyError(message: string) {
    if (this.blockNotification(this.type, message)) {
      this.time = Date.now();
      return;
    } else {
      this.setValidationValues(notificationEnum.error, message, Date.now());

      this.snotifyService
        .error(message, {
          timeout: 8000,
          showProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          bodyMaxLength: 400,
        })
        .on('shown', (toast) => {
          if (this.snotifyNotifications.indexOf(toast.id) === -1) {
            this.snotifyNotifications.push(toast.id);
          }
        });
    }
  }

  public notifyWarning(message: string) {
    if (this.blockNotification(this.type, message)) {
      this.time = Date.now();
      return;
    } else {
      this.setValidationValues(notificationEnum.warning, message, Date.now());

      this.snotifyService
        .warning(message, {
          timeout: 8000,
          showProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          bodyMaxLength: 400,
        })
        .on('shown', (toast) => {
          if (this.snotifyNotifications.indexOf(toast.id) === -1) {
            this.snotifyNotifications.push(toast.id);
          }
        });
    }
  }

  public notifySuccess(message: string) {
    if (this.blockNotification(this.type, message)) {
      this.time = Date.now();
      return;
    } else {
      this.setValidationValues(notificationEnum.success, message, Date.now());

      this.snotifyService
        .success(message, {
          timeout: 8000,
          showProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          bodyMaxLength: 400,
        })
        .on('shown', (toast) => {
          if (this.snotifyNotifications.indexOf(toast.id) === -1) {
            this.snotifyNotifications.push(toast.id);
          }
        });
    }
  }

  public notifyHTML(message: string) {
    if (this.blockNotification(this.type, message)) {
      this.time = Date.now();
      return;
    } else {
      this.setValidationValues(notificationEnum.html, message, Date.now());

      this.snotifyService
        .html(message, {
          timeout: 8000,
          showProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          bodyMaxLength: 400,
        })
        .on('shown', (toast) => {
          if (this.snotifyNotifications.indexOf(toast.id) === -1) {
            this.snotifyNotifications.push(toast.id);
          }
        });
    }
  }

  notifyAsync(
    action: Promise<any>,
    messages?: {
      beforeLoadMessage?: string;
      afterLoadMessage?: string;
      errorLoadMessage?: string;
    }
  ) {
    const DEFAULT_BEFORE_MESSAGE = 'Carregando dados, por favor aguarde.',
      DEFAULT_AFTER_MESSAGE = 'Dados carregados com sucesso!',
      DEFAULT_ERROR_MESSAGE =
        'Ocorreu um erro ao tentar carregar os dados. Tente novamente.';

    if (
      this.blockNotification(
        this.type,
        messages.beforeLoadMessage || DEFAULT_BEFORE_MESSAGE
      )
    ) {
      this.time = Date.now();
      return;
    } else {
      this.setValidationValues(
        notificationEnum.async,
        messages.beforeLoadMessage || DEFAULT_BEFORE_MESSAGE,
        Date.now()
      );

      this.snotifyService
        .async(
          messages.beforeLoadMessage || DEFAULT_BEFORE_MESSAGE,
          new Promise((resolve, reject) => {
            return action.then(
              (_) => {
                resolve({
                  body: messages.afterLoadMessage || DEFAULT_AFTER_MESSAGE,
                  config: {
                    timeout: 8000,
                    showProgressBar: true,
                    closeOnClick: true,
                    bodyMaxLength: 400,
                  },
                });
              },
              (_) => {
                reject({
                  body: messages.errorLoadMessage || DEFAULT_ERROR_MESSAGE,
                  config: {
                    timeout: 8000,
                    showProgressBar: true,
                    closeOnClick: true,
                    bodyMaxLength: 400,
                  },
                });
              }
            );
          }),
          {
            closeOnClick: false,
            bodyMaxLength: 400,
          }
        )
        .on('shown', (toast) => {
          if (this.snotifyNotifications.indexOf(toast.id) === -1) {
            this.snotifyNotifications.push(toast.id);
          }
        });
    }
  }

  public clear() {
    if (this.snotifyNotifications.length > 0) {
      this.snotifyService.clear();
      this.snotifyNotifications = [];
    }
  }

  private blockNotification(type: notificationEnum, message: string) {
    return (
      this.type === type &&
      this.message === message &&
      Date.now() - this.time < 1000
    );
  }

  private setValidationValues(type, message, time) {
    this.type = type;
    this.message = message;
    this.time = time;
  }
}

enum notificationEnum {
  warning = 1,
  error = 2,
  success = 3,
  html = 4,
  async = 5,
}

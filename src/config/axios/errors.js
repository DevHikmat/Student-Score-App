import { openNotification } from "../../utils/Messenger";

export class ResponseError {
  constructor(error) {
    this.error = error;
    this.errors(error.response?.status);
  }

  errors(status) {
    switch (status) {
      case 400:
        this[400]();
        break;
      case 401:
        this[401]();
        break;
      case 403:
        this[403]();
        break;
      case 404:
        this[404]();
        break;
      case 422:
        this[422]();
        break;
      case 500:
        this[500]();
        break;
      default:
        this.withoutStatusError();
    }
  }

  400() {
    openNotification("error", this?.error?.response?.data?.message);
  }

  403() {
    openNotification("error", "Faydalanish huquqi yo'q!");
  }

  404() {
    openNotification("error", "Ma'lumot topilmadi!");
  }

  422() {}

  500() {
    openNotification("error", this.error.message);
  }

  withoutStatusError() {}
}

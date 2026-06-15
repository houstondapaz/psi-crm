import type { AlertItem } from "./alert-service";
import type { EmailSender } from "./alert-service";

export type NotificationChannel = {
  readonly name: string;
  sendAlerts(alertas: AlertItem[]): Promise<void>;
};

export class InAppNotificationChannel implements NotificationChannel {
  readonly name = "in-app";

  async sendAlerts(alertas: AlertItem[]): Promise<void> {
    void alertas;
  }
}

export class EmailNotificationChannel implements NotificationChannel {
  readonly name = "email";

  constructor(private readonly sendEmail: EmailSender) {}

  async sendAlerts(alertas: AlertItem[]): Promise<void> {
    for (const alert of alertas) {
      await this.sendEmail({
        to: "usuario@consultorio.com",
        subject: `[CRM Psi] ${alert.title}`,
        body: `${alert.patientName} — ${alert.referenceDate}`,
      });
    }
  }
}

export class PushNotificationChannel implements NotificationChannel {
  readonly name = "push";

  async sendAlerts(alertas: AlertItem[]): Promise<void> {
    void alertas;
    throw new Error("Push notifications not implemented");
  }
}

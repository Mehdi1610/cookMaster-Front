import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messageService = inject(MessageService);
  private readonly defaultLife = 1500;

  info(summary: string, detail?: string) {
    this.messageService.add(this.getDefaultToastOptions('info', summary, detail));
  }

  success(summary: string, detail?: string) {
    this.messageService.add(this.getDefaultToastOptions('success', summary, detail));
  }

  warn(summary: string, detail?: string) {
    this.messageService.add(this.getDefaultToastOptions('warn', summary, detail));
  }

  error(summary: string, detail?: string) {
    this.messageService.add(this.getDefaultToastOptions('error', summary, detail));
  }

  private getDefaultToastOptions(severity: string, summary: string, detail?: string) {
    return { severity: severity, summary, detail, life: this.defaultLife };
  }
}

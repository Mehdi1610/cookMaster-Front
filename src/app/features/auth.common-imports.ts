import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import {IftaLabelModule } from 'primeng/iftalabel';
import { DividerModule } from 'primeng/divider';

export const authCommonImports = [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    RouterLink,
    MessageModule,
    IftaLabelModule,
    DividerModule
];
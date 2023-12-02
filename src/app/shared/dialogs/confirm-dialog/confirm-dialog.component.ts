import { Component } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

}

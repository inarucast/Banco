import {Component, Input, Output, EventEmitter, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FinancialProducts} from "../../models/productos-financieros";
import {BancoService} from "../../../core/https/banco.service";
import {finalize} from "rxjs";
import {SkeletonComponent} from "../../components/skeleton/skeleton.component";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonComponent
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() product!: FinancialProducts;
  @Output() showDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

  bancoService = inject(BancoService);
  isLoading = false;

  confirmDelete(): void {
    this.isLoading = true;
    this.bancoService.deleteProduct(this.product.id).pipe(
      finalize(() => {
        this.bancoService.reloadTableSubject.next(true);
        this.showDialog.emit(false);
        this.isLoading = false;
      })
    ).subscribe();
  }

  cancelDelete(): void {
    this.showDialog.emit(false);
  }

}

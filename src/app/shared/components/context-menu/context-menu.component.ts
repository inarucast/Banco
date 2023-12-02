import {Component, ElementRef, HostListener, inject, Input, ViewChild} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {FinancialProducts} from "../../models/productos-financieros";
import {BancoService} from "../../../core/https/banco.service";
import {ConfirmDialogComponent} from "../../dialogs/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
  @Input() product!: FinancialProducts;
  show: boolean = false;
  showDialog: boolean = false;

  router = inject(Router);
  elementRef = inject(ElementRef);

  showMenu() {
    this.show = !this.show;
  }

  onDocumentClick(event: any) {
    if (!this.elementRef?.nativeElement.contains(event.target)) {
      this.show = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.show = false;
  }


  edit(): void {
    const productData: FinancialProducts = {
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      logo: this.product.logo,
      date_release: this.product.date_release,
      date_revision: this.product.date_revision
    }

    this.router.navigate(['/add-product/' + this.product.id, productData]).then();
  }

  delete(): void {
    this.showMenu();
    this.showDialog = !this.showDialog;
  }
}

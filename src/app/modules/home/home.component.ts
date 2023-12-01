import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, fromEvent, merge, startWith, Subject, switchMap} from "rxjs";
import {FinancialProducts} from "../../shared/models/productos-financieros";
import {BancoService} from "../../core/https/banco.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  bancoService = inject(BancoService);
  products: FinancialProducts[] = [];
  productSubject = new Subject();
  isLoading = true;

  search = new FormControl('');

  @ViewChild('filterInput', {static: true}) filterInput: ElementRef | undefined;

  ngOnInit(): void {
    merge(this.productSubject, fromEvent(this.filterInput?.nativeElement, 'keydown')).pipe(
      startWith({}),
      debounceTime(500),
      switchMap(() => {
        this.isLoading = true;

        return this.bancoService.getAllProducts(this.filterInput?.nativeElement.value);
      })
    ).subscribe({
      next: res => {
        this.products = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  deleteProduct(productId: string): void {

  }

  isValidUrl(url: string): string {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].\S*$/i;
    const isValid = urlRegex.test(url);
    return isValid ? url : 'https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png';
  }
}

import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, fromEvent, merge, startWith, Subject, switchMap} from "rxjs";
import {FinancialProducts} from "../../shared/models/productos-financieros";
import {BancoService} from "../../core/https/banco.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
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
      error: err => {
        this.isLoading = false;
      }
    });
  }

  isValidUrl(url: string): boolean {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    return urlRegex.test(url);
  }
}

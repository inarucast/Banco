import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, fromEvent, merge, startWith, Subject, Subscription, switchMap} from "rxjs";
import {FinancialProducts} from "../../shared/models/productos-financieros";
import {BancoService} from "../../core/https/banco.service";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SkeletonComponent} from "../../shared/components/skeleton/skeleton.component";
import {ContextMenuComponent} from "../../shared/components/context-menu/context-menu.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SkeletonComponent,
    ContextMenuComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  bancoService = inject(BancoService);
  subscriptions = new Subscription();
  products: FinancialProducts[] = [];
  productSubject = new Subject();
  isLoading = true;
  search = new FormControl('');

  @ViewChild('filterInput', {static: true}) filterInput: ElementRef | undefined;

  ngOnInit(): void {
    this.getAllProduct();

    this.subscriptions.add(
      this.bancoService.reloadTableSubject.subscribe(() => {
        this.getAllProduct();
      }));
  }

  getAllProduct() {
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

  isValidUrl(url: string): string {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].\S*$/i;
    const isValid = urlRegex.test(url);
    return isValid ? url : 'https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

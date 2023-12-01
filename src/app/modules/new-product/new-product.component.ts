import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CommonModule, DatePipe} from "@angular/common";
import {BancoService} from "../../core/https/banco.service";
import {ActivatedRoute, RouterLink} from "@angular/router";

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
  providers: [DatePipe]
})
export class NewProductComponent {

  route = inject(ActivatedRoute);
  productId = this.route.snapshot.paramMap.get('id');
  bancoService = inject(BancoService);
  datePipe = inject(DatePipe);
  productForm!: FormGroup;

  ngOnInit(): void {
    this.buildProductForm();
  }

  buildProductForm(): void {
    this.productForm = new FormGroup({
      id: new FormControl('', {validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)]}),
      name: new FormControl('', {validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100)]}),
      description: new FormControl('', {validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)]}),
      logo: new FormControl('', {validators: [Validators.required]}),
      date_release: new FormControl('', {validators: [Validators.required, this.validateDate()]}),
      date_revision: new FormControl({value: '', disabled: true}, {validators: [Validators.required]}),
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(dateOfRelease => {
      if (dateOfRelease) {
        this.setDateOfRevision(dateOfRelease);
      }
    });

  }

  onIdChange(id: string): void {
    const control = this.productForm!.controls['id'];
    if (id.trim()) {
      this.bancoService.verifyProduct(id).subscribe({
        next: (res) => {
          if (!res) {
            delete control.errors?.['alreadyExist'];
            control.updateValueAndValidity();
          } else {
            control.setErrors({alreadyExist: true});
          }
        },
        error: () => {

        },
        complete: () => {

        }
      });
    }
  }

  validateDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date().toISOString().split('T')[0];
      const selectedDate = control.value;
      if (selectedDate && (selectedDate != currentDate && selectedDate < currentDate)) {
        return {invalidDate: true};
      }

      return null;
    };
  }

  setDateOfRevision(dateOfRelease: string): void {
    const revisedDate = new Date(dateOfRelease);
    revisedDate.setFullYear(revisedDate.getFullYear() + 1);
    const formattedDate = this.datePipe.transform(revisedDate, 'yyyy-MM-dd');
    this.productForm.get('date_revision')?.setValue(formattedDate);
  }

  resetForm(): void {
    this.productForm!.reset();
  }

  onSubmit(): void {
    this.bancoService.createProduct(this.productForm.getRawValue())
      .subscribe({
        next: () => {

        },
        error: () => {

        }
      });
  }
}

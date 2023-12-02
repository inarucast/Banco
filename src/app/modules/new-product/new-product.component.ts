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
import {CommonModule, DatePipe, Location} from "@angular/common";
import {BancoService} from "../../core/https/banco.service";
import {ActivatedRoute, Params, RouterLink} from "@angular/router";
import {SkeletonComponent} from "../../shared/components/skeleton/skeleton.component";

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, SkeletonComponent],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
  providers: [DatePipe]
})
export class NewProductComponent {

  route = inject(ActivatedRoute);
  location = inject(Location);
  bancoService = inject(BancoService);
  datePipe = inject(DatePipe);
  productForm!: FormGroup;
  productData: Params | undefined
  isLoading = false;

  private getCommonValidators(minLength: number, maxLength: number): ValidatorFn[] {
    return [Validators.required, Validators.minLength(minLength), Validators.maxLength(maxLength)];
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productData = params;
      if (this.productData && this.productData['id']) {
        this.location.replaceState('/add-product/' + this.productData['id']);
      } else {
        this.location.replaceState('/add-product');
      }
    });

    this.buildProductForm();
  }

  buildProductForm(): void {
    const {id, name, description, logo, date_release, date_revision} = this.productData || {};
    const disabledId = !!id;
    const releaseDate = date_release ? this.datePipe.transform(date_release, 'yyyy-MM-dd') : '';
    const revisionDate = date_release ? this.datePipe.transform(date_revision, 'yyyy-MM-dd') : '';

    this.productForm = new FormGroup({
      id: new FormControl({value: id || '', disabled: disabledId}, this.getCommonValidators(3, 10)),
      name: new FormControl(name || '', this.getCommonValidators(5, 100)),
      description: new FormControl(description || '', this.getCommonValidators(10, 200)),
      logo: new FormControl(logo || '', [Validators.required]),
      date_release: new FormControl(releaseDate, [Validators.required, this.validateDate()]),
      date_revision: new FormControl(revisionDate, [Validators.required]),
    }, {validators: this.validateDateOfRevision()})

    this.productForm.get('date_release')?.valueChanges.subscribe(dateOfRelease => {
      if (dateOfRelease) {
        this.setDateOfRevision(dateOfRelease);
      }
    });

    if (this.productData && this.productData['id']) {
      Object.values(this.productForm.controls).forEach((control: AbstractControl) => {
        if (control.value) {
          control.markAsDirty();
        }
      });
    }

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

  validateDateOfRevision(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateRelease = control.get('date_release');
      const dateRevision = control.get('date_revision');

      if (dateRelease && dateRevision) {
        if (!dateRelease.value) {
          return {invalidateDateOfRelease: true};
        }
        const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000;
        const releaseDate = new Date(dateRelease.value).getTime();
        const revisionDate = new Date(dateRevision.value).getTime();

        if (revisionDate < releaseDate + oneYearInMilliseconds) {
          return {invalidDateRevision: true};
        }
      }

      return null;
    }
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
    this.isLoading = true;

    const productFormValue = this.productForm.getRawValue();

    const observable = this.productData && this.productData['id']
      ? this.bancoService.updateProduct(productFormValue)
      : this.bancoService.createProduct(productFormValue);

    observable.subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    });
  }

}

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewProductComponent} from './new-product.component';
import {HttpClientModule} from "@angular/common/http";
import {BancoService} from "../../core/https/banco.service";
import {provideRouter} from "@angular/router";

describe('NewProductComponent', () => {
  let component: NewProductComponent;
  let fixture: ComponentFixture<NewProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductComponent, HttpClientModule],
      providers: [provideRouter([]), BancoService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should validate date of revision', () => {
    const validateDateOfRevision = component.validateDateOfRevision();

    const mockForm = {
      get: (controlName: string) => {
        if (controlName === 'date_release') {
          return { value: '2023-01-01' };
        } else if (controlName === 'date_revision') {
          return { value: '2022-01-01' };
        }
        return null;
      }
    };

    const mockControl = {
      get: (controlName: string) => {
        if (controlName === 'date_release') {
          return { value: '2023-01-01' };
        } else if (controlName === 'date_revision') {
          return { value: '2022-01-01' };
        }
        return null;
      }
    };

    expect(validateDateOfRevision(mockForm as any)).toEqual({ invalidDateRevision: true });
    expect(validateDateOfRevision(mockControl as any)).toEqual({ invalidDateRevision: true });

    mockForm.get = (controlName: string) => {
      if (controlName === 'date_release') {
        return { value: '2023-01-01' };
      } else if (controlName === 'date_revision') {
        return { value: '2024-01-01' };
      }
      return null;
    };

    mockControl.get = (controlName: string) => {
      if (controlName === 'date_release') {
        return { value: '2023-01-01' };
      } else if (controlName === 'date_revision') {
        return { value: '2024-01-01' };
      }
      return null;
    };

    expect(validateDateOfRevision(mockForm as any)).toEqual(null);
    expect(validateDateOfRevision(mockControl as any)).toEqual(null);
  });

});

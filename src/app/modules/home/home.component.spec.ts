import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {HttpClientModule} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {BancoService} from "../../core/https/banco.service";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientModule],
      providers: [provideRouter([]), BancoService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update page size and load pages', () => {
    const event = { value: 10 };
    spyOn(component, 'loadPages');

    component.updatePageSize(event);

    expect(component.pageSize).toEqual(10);
    expect(component.loadPages).toHaveBeenCalled();
  });

});

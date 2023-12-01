import {Component, HostListener, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {NavBarComponent} from "./shared/components/nav-bar/nav-bar.component";
import {HttpClientModule} from '@angular/common/http';
import {ResponsiveService} from "./core/https/responsive.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'banco';

  private responsiveService: ResponsiveService = inject(ResponsiveService);

  @HostListener('window:resize', ['$event'])
  onResize(event: Window): void {
    this.responsiveService.setWidthType(event.innerWidth);
  }

  ngOnInit(): void {
    this.responsiveService.setWidthType(window.innerWidth);
  }
}

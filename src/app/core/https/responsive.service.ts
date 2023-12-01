import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type WidthType = 'desktop' | 'mobile' | null;

@Injectable({providedIn: 'root'})
export class ResponsiveService {

  private widthType$ = new BehaviorSubject<WidthType>(null);

  constructor() { }

  setWidthType(windowSize: number): void {
    const isMobileSize = !!(navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      || windowSize <= 991.98);
    this.widthType$.next( isMobileSize ? 'mobile' : 'desktop');
  }

  getWidthType(): Observable<WidthType> {
    return this.widthType$;
  }
}

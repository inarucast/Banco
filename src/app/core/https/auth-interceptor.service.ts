import {inject} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse, HttpRequest, HttpHandlerFn
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

export const AuthInterceptorService: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  const router: Router = inject(Router);

  request = request.clone({
    setHeaders: {
      authorId: '336',
    }
  });

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        router.navigateByUrl('').then();
      }
      return throwError(() => err);
    })
  );

};

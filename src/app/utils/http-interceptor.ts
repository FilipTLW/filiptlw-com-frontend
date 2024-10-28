import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler, HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, Observable, switchMap, tap} from 'rxjs';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {TerminalService} from '../terminal/terminal.service';

export const INTERCEPT_UNAUTHORIZED = new HttpContextToken<boolean>(() => true);

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private _http: HttpClient, private _terminalService: TerminalService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      if (error.status === 401 && req.context.get(INTERCEPT_UNAUTHORIZED)) {
        return this._http.post(`${environment.apiUrl}/auth/refresh`, {}, {
          withCredentials: true,
          context: new HttpContext().set(INTERCEPT_UNAUTHORIZED, false)
        }).pipe(switchMap(() => {
          return next.handle(req.clone());
        }));
      }
      throw error;
    }));
  }

}

export class CacheInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpRequest = req.clone({
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      })
    });

    return next.handle(httpRequest);
  }
}

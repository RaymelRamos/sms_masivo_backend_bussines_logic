import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../shared/notifications/notification.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements HttpInterceptor {
  constructor(private _router: Router,
    private notificationService: NotificationService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string = localStorage.getItem('token');
    var request = req;
    if (token) {
      console.log(token)
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    console.log(request)
    return next.handle(request)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        let errorMessage = this.handleError(error);
        return throwError(errorMessage);
      })
    )
  }

  private handleError = (error: HttpErrorResponse) : string => {
    console.log(error);
    if(error.status === 404){
      return this.handleNotFound(error);
    }
    else if(error.status === 401){
      return this.handleUnathorizeRequest(error);
    }
    else if(error.status === 403){
      return this.handleForbiddenRequest(error);
    }
    else if(error.status === 400){
      return this.handleBadRequest(error);
    }
    else if(error.status === 500){
      return this.handleInternalServerErrorRequest(error);
    }
  }
  private handleNotFound = (error: HttpErrorResponse): string => {
    console.log(error);
    this.notificationService.errorMessagesNotification("Validation", "Resource not found");
    this._router.navigate(['/404']);
    return error.message;
  }
  private handleBadRequest = (error: HttpErrorResponse): string => {
    console.log(error);
    this.notificationService.errorMessagesNotification("Validation", error.message);
    if(this._router.url === '/authentication/login'){
      let message = '';
      const values = Object.values(error.error.errors);
      values.map((m: string) => {
         message += m + '<br>';
      })
      return message.slice(0, -4);
    }
    else{
      return error.error ? error.error : error.message;
    }
  }
  private handleInternalServerErrorRequest = (error: HttpErrorResponse): string => {
    console.log(error);
    this.notificationService.errorMessagesNotification("Validation", error.message);
    this._router.navigate(['500']);
    return error.message;
  }
  private handleUnathorizeRequest = (error: HttpErrorResponse): string => {
    this.notificationService.errorMessagesNotification("Validation", error.error.message);
    this._router.navigate(['login']);
    return error.message;
  }
  private handleForbiddenRequest = (error: HttpErrorResponse): string => {
    console.log(error);
    this.notificationService.errorMessagesNotification("Validation", error.message);
    this._router.navigate(['dashboard']);
    return error.message;
  }
}

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { GroupModel as Grupo } from '../models/group-model';
import { SMSModel } from '../models/sms-model';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  private smsUrl = environment.apiUrl + '/bussines/sms';

  constructor(private http: HttpClient) { }

  createSms(sms: any): Observable<SMSModel> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<SMSModel>(this.smsUrl, sms, { headers })
      .pipe(
        tap(data => console.log('createGroup: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getAllSms(): Observable<SMSModel[]> {
    return this.http.get<SMSModel[]>(this.smsUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getSmsByGroup(uuid: string): Observable<SMSModel> {
    return this.http.get<SMSModel>(this.smsUrl + `/${uuid}/group`)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getGroupById(uuid: string): Observable<SMSModel> {
    return this.http.get<SMSModel>(this.smsUrl + `/${uuid}`)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
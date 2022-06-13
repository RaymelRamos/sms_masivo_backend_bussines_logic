import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { GroupModel as Grupo } from '../models/group-model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupUrl = environment.apiUrl + '/bussines/group';

   constructor(private http: HttpClient) { }
  
  createGroup(grupo: any): Observable<Grupo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Grupo>(this.groupUrl, grupo, { headers })
      .pipe(
        tap(data => console.log('createGroup: ' + JSON.stringify(data))),
        // catchError(this.handleError)
      );
  }

  updateGroup(grupo: any, id: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<any>(`${this.groupUrl}/${id}`, grupo, { headers })
      .pipe(
        tap(() => console.log('updateGroup: ' + grupo.uuid)),
        // Return the product on an update
        map(() => grupo),
        // catchError(this.handleError)
      );
  }

  deleteGroup(id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.groupUrl}/${id}`;
    return this.http.delete<Grupo>(`${this.groupUrl}/${id}`, { headers })
      .pipe(
        tap(data => console.log('deleteGroup: ' + id)),
        // catchError(this.handleError)
      );
  }
 
  getAllGroup(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.groupUrl)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        // catchError(this.handleError)
      );
  }

  getSimpleGroup(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.groupUrl + '/simple')
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        // catchError(this.handleError)
      );
  }

  getGroupById(uuid: string): Observable<Grupo> {
    return this.http.get<Grupo>(this.groupUrl + `/group/${uuid}`)
      .pipe(
        tap(data => console.log('All: ' + JSON.stringify(data))),
        // catchError(this.handleError)
      );
  }

  // private handleError(err: HttpErrorResponse): Observable<never> {
  //   // in a real world app, we may send the server to some remote logging infrastructure
  //   // instead of just logging it to the console
  //   let errorMessage = '';
  //   console.log(err)
  //   if (err.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     errorMessage = `An error occurred: ${err.error.message}`;
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  //   }
  //   console.error(errorMessage);
  //   return throwError(errorMessage);
  // }
}
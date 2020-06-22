import { Injectable } from '@angular/core';
import { Feedback   } from '../shared/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProcessHTTPMsgService } from './process-httpmsg.service';



@Injectable({
  providedIn: 'root'
})
export class FebackService {

  constructor( private http: HttpClient ,
               private ss :ProcessHTTPMsgService) { }
  

  getFedbacks() : Observable<Feedback[]>{

    return this.http.get<Feedback[]>(baseURL +'feedback')
    .pipe(catchError(this.ss.handleError));
  }

  addFedback(fee:Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    return this.http.post<Feedback>(baseURL +'feedback', fee , httpOptions)
    .pipe(catchError(this.ss.handleError))
    

  }

}

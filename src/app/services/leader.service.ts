import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { resolve } from 'url';

import { Observable,of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor( private http : HttpClient , private ss : ProcessHTTPMsgService) { }


  getLeaders(): Observable<Leader[]> {

    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.ss.handleError));

  } 
 
  getLeader(id : number): Observable<Leader> {

     return  this.http.get<Leader>(baseURL +'leadership/'+ id)
     .pipe(catchError(this.ss.handleError));

  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader[]>(baseURL +'leadership?featured=true')
    .pipe(map(leaders=>leaders[3]))
    .pipe(catchError(this.ss.handleError));
    
      
  }
}

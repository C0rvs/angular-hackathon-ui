import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ezBookInterface } from '../inteface/hsCodes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HscodesService {
  private urlLink = 'http://localhost:3000/hscodes';
  constructor(private client: HttpClient) { }


  getList():Observable<ezBookInterface[]>{
    return this.client.get<ezBookInterface[]>(this.urlLink);
  }




}
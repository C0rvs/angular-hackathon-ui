import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { hsCodes } from '../interface/hsCodes';
@Injectable({
  providedIn: 'root'
})
export class HscodesService {
  private urlLink = 'http://localhost:3000/hscodes';
  constructor(private client: HttpClient) { }


  getList(): Observable<hsCodes[]> {
    return this.client.get<hsCodes[]>(this.urlLink);
  }
}
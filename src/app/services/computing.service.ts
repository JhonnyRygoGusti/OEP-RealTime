import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComputingService {

  private EndPoint;

  constructor(private httpClient: HttpClient) {
    this.EndPoint = environment.endPoint
  }

  public getData() {
    return this.httpClient
      .post(`${this.EndPoint}resultado/presidente`,{});
  }
  
}

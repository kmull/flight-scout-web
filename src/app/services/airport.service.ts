import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AirportDto } from '../models/airport.model';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  private http = inject(HttpClient);
  private apiUri = 'http://localhost:9002/api/airports';

  search(request: string): Observable<AirportDto[]> {
    const params = new HttpParams().set('request', request);
    return this.http.get<AirportDto[]>(`${this.apiUri}/search`, { params });
  }
}

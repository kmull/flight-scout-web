import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlightOfferDto, FlightSearchRequest } from '../models/flight.model';

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:9002/api/flights';


  search(request: FlightSearchRequest): Observable<FlightOfferDto[]> {
    let params = new HttpParams()
      .set('origin', request.origin)
      .set('destination', request.destination)
      .set('departureDate', request.departureDate)
      .set('passengers', request.passengers.toString())
      .set('cabinClass', request.cabinClass)
      .set('limit', (request.limit ?? 20).toString());

    if (request.returnDate) {
      params = params.set('returnDate', request.returnDate);
    }

    return this.http.get<FlightOfferDto[]>(this.API_URL, { params });
  }
}

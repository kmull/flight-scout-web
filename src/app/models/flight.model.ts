import { CabinClass } from "../enums/cabin-class.enum";

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: CabinClass;
  limit?: number;
}

export interface FlightOfferDto {
  offerId: string;
  totalAmount: string;
  totalCurrency: string;
  airlineCode: string;
  airlineName: string;
  slices: FlightSliceDto[];
}

export interface FlightSliceDto {
  origin: string;
  destination: string;
  duration: string;
  stops: number;
  departureAt: string;
  arrivingAt: string;
}

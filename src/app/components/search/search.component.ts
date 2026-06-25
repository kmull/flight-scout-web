import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CabinClass, CabinClassLabels } from '../../enums/cabin-class.enum';
import { AirportDto } from '../../models/airport.model';
import { FlightOfferDto } from '../../models/flight.model';
import { AirportService } from '../../services/airport.service';
import { FlightService } from '../../services/flight.service';
import { AirportAutocompleteComponent } from '../shared/airport-autocomplete/airport-autocomplete.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    DatePipe,
    AirportAutocompleteComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);

  offers = signal<FlightOfferDto[]>([]);
  loading = signal(false);
  searched = signal(false);
  errorMessage = signal<string | null>(null);

  cabinClasses = Object.values(CabinClass);
  cabinClassLabels = CabinClassLabels;

  form = this.fb.group({
    origin: [null, Validators.required],
    destination: [null, Validators.required],
    departureDate: [null, Validators.required],
    returnDate: [null],
    passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    cabinClass: [CabinClass.ECONOMY, Validators.required]
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const val = this.form.value;
    this.loading.set(true);
    this.errorMessage.set(null);
    this.offers.set([]);

    this.flightService.search({
      origin: val.origin!,
      destination: val.destination!,
      departureDate: this.formatDate(val.departureDate),
      returnDate: this.formatDate(val.returnDate) || undefined,
      passengers: val.passengers!,
      cabinClass: val.cabinClass!,
      limit: 20
    }).subscribe({
      next: (result) => {
        this.offers.set(result);
        this.searched.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Nie udało się wyszukać lotów. Spróbuj ponownie.');
        this.loading.set(false);
      }
    });
  }

  private formatDate(date: any): string {
    if (!date) return '';
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return date;
  }

  formatDuration(iso: string): string {
    if (!iso) return '';
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return iso;
    const h = match[1] ? `${match[1]}h ` : '';
    const m = match[2] ? `${match[2]}min` : '';
    return `${h}${m}`.trim();
  }

  stopsLabel(stops: number): string {
    if (stops === 0) return 'Bezpośredni';
    if (stops === 1) return '1 przesiadka';
    return `${stops} przesiadki`;
  }
}

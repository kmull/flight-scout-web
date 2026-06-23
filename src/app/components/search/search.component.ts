import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { CabinClass, CabinClassLabels } from '../../enums/cabin-class.enum';
import { FlightOfferDto } from '../../models/flight.model';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-search.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    DatePipe
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {

  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);
  private toastrService = inject(ToastrService);

  offers = signal<FlightOfferDto[]>([]);
  loading = signal(false);
  searched = signal(false);
  errorMessage = signal<string | null>(null);

  cabinClasses = Object.values(CabinClass);
  cabinClassLabels = CabinClassLabels;

  form = this.fb.group({
    origin: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    destination: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    departureDate: ['', Validators.required],
    returnDate: [''],
    passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    cabinClass: [CabinClass.ECONOMY, Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastrService.error('Wypełnij wszystkie wymagane pola poprawnie.', 'Błąd walidacji');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.offers.set([]);

    const val = this.form.value;

    this.flightService.search({
      origin: val.origin!.toUpperCase(),
      destination: val.destination!.toUpperCase(),
      departureDate: this.formatDate(val.departureDate as unknown as Date)!,
      returnDate: this.formatDate(val.returnDate as unknown as Date),
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

  private formatDate(date: Date | null): string | undefined {
    if (!date) return undefined;
    return date.toISOString().split('T')[0];
  }

}

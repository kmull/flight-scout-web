import { Component, forwardRef, inject, input, OnDestroy, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AirportDto } from '../../../models/airport.model';
import { AirportService } from '../../../services/airport.service';

@Component({
  selector: 'app-airport-autocomplete',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './airport-autocomplete.component.html',
  styleUrl: './airport-autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AirportAutocompleteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AirportAutocompleteComponent),
      multi: true
    }
  ]
})
export class AirportAutocompleteComponent implements ControlValueAccessor, Validator, OnDestroy {

  private airportService = inject(AirportService);

  label = input<string>('Lotnisko');
  icon = input<string>('flight');

  displayValue = signal('');
  suggestions = signal<AirportDto[]>([]);
  isDisabled = signal(false);
  selectedIataCode = signal<string | null>(null);

  private inputSubject$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  // callbacki które Angular rejestruje przez registerOnChange/registerOnTouched
  private onChange: (value: string | null) => void = () => { };
  private onTouched: () => void = () => { };

  constructor() {
    this.inputSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(res => res.length >= 2
          ? this.airportService.search(res).pipe(catchError(() => of([])))
          : of([])
        ),
        takeUntil(this.destroy$)
      ).subscribe(results => this.suggestions.set(results));
  }

  writeValue(iataCode: string | null): void {
    if (!iataCode) {
      this.displayValue.set('');
      this.selectedIataCode.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.selectedIataCode()) {
      return { airportNotSelected: true };
    }
    return null;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.displayValue.set(value);
    this.selectedIataCode.set(null);
    this.onChange(null);
    this.inputSubject$.next(value);
  }

  onSelect(airport: AirportDto): void {
    this.selectedIataCode.set(airport.iataCode);
    this.displayValue.set(airport.label);
    this.suggestions.set([]);
    this.onChange(airport.iataCode);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

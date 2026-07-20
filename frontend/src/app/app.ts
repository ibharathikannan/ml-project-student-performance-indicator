import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PredictionService } from './services/prediction.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly fb = inject(FormBuilder);
  private readonly predictionService = inject(PredictionService);

  // Signals: this app runs zoneless, so plain mutable fields updated inside
  // an RxJS subscribe callback would never trigger a re-render.
  readonly submitted = signal(false);
  readonly loading = signal(false);
  readonly prediction = signal<number | null>(null);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    gender: ['', Validators.required],
    race_ethnicity: ['', Validators.required],
    parental_level_of_education: ['', Validators.required],
    lunch: ['', Validators.required],
    test_preparation_course: ['', Validators.required],
    reading_score: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]],
    writing_score: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  onSubmit(): void {
    this.submitted.set(true);
    this.error.set(null);
    this.prediction.set(null);

    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    const value = this.form.getRawValue();

    this.predictionService
      .predict({
        gender: value.gender!,
        race_ethnicity: value.race_ethnicity!,
        parental_level_of_education: value.parental_level_of_education!,
        lunch: value.lunch!,
        test_preparation_course: value.test_preparation_course!,
        reading_score: value.reading_score!,
        writing_score: value.writing_score!,
      })
      .subscribe({
        next: (res) => {
          this.prediction.set(res.prediction);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Something went wrong while predicting. Please try again.');
          this.loading.set(false);
        },
      });
  }
}

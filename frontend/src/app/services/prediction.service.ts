import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  gender: string;
  race_ethnicity: string;
  parental_level_of_education: string;
  lunch: string;
  test_preparation_course: string;
  reading_score: number;
  writing_score: number;
}

export interface PredictionResponse {
  prediction: number;
}

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private readonly apiUrl = '/api/predict';

  constructor(private readonly http: HttpClient) {}

  predict(payload: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.apiUrl, payload);
  }
}

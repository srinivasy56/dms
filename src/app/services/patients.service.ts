import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../app.component';

const URL = '/patients/';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  http = inject(HttpClient);

  getPatientsData() {
    return this.http.get(URL);
  }

  addPatient(patientData: any) {
    return this.http.post(URL, patientData);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddPatientComponent],
  imports: [ReactiveFormsModule, CommonModule],
  exports: [AddPatientComponent],
})
export class PatientsModule {}

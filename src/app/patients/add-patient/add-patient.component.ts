import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from 'src/app/app.component';
import { PatientsService } from 'src/app/services/patients.service';

@Component({
  selector: 'add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
})
export class AddPatientComponent {
  patientForm!: FormGroup;
  selectedFile: File | null = null;
  fileError: string = '';
  today!: string;

  constructor(private fb: FormBuilder) {}
  patientService = inject(PatientsService);

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      patient_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      age: [{ value: '', disabled: true }],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      report: [null], // This will be set manually on file change
    });
    const now = new Date();
    this.today = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  get f() {
    return this.patientForm.controls;
  }

  calculateAge(): void {
    const dob = new Date(this.patientForm.get('date_of_birth')?.value);
    if (!isNaN(dob.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      this.patientForm.get('age')?.setValue(age);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Unsupported file type.';
        this.selectedFile = null;
        return;
      }
      this.fileError = '';
      this.selectedFile = file;
      this.patientForm.get('report')?.setValue(file);
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid || !this.selectedFile) {
      this.fileError = this.selectedFile ? '' : 'Report file is required.';
      return;
    }

    const formData = new FormData();
    formData.append('patient_name', this.f['patient_name'].value);
    formData.append('date_of_birth', this.f['date_of_birth'].value);
    formData.append('age', this.f['age'].value);
    formData.append('phone', this.f['phone'].value);
    formData.append('email', this.f['email'].value);
    formData.append('gender', this.f['gender'].value);
    formData.append('address', this.f['address'].value);
    formData.append('report', this.selectedFile as Blob);

    this.patientService.addPatient(formData as any).subscribe({
      next: (res) => {
        console.log('Success:', res);
        this.patientForm.reset();
        alert('Patient added successfully!');
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to add patient. Please try again.');
      },
    });
  }
}

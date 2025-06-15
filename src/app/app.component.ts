import { Component, inject, OnInit } from '@angular/core';
import { PatientsService } from './services/patients.service';

export class Patient {
  id?: number;
  patient_name?: string;
  date_of_birth?: Date;
  age?: number;
  phone?: string;
  email?: string;
  gender?: 'M' | 'F';
  address?: string;
  report?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'dms';
  myService = inject(PatientsService);
  patientsList: Patient[] = [];

  ngOnInit(): void {
    this.myService.getPatientsData().subscribe((res: any) => {
      this.patientsList = res;
    });
  }

  downloadReport(filePath?: string | null) {
    const fileUrl = 'http://127.0.0.1:8000' + filePath;
    fetch(fileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('File download failed');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filePath?.split('/').pop() || 'report.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  }
}

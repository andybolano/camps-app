import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Camp, CampService } from '../../services/camp.service';

@Component({
  selector: 'app-camps',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './camps.component.html',
  styleUrl: './camps.component.scss',
})
export class CampsComponent implements OnInit {
  camps: Camp[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private campService: CampService) {}

  ngOnInit(): void {
    this.loadCamps();
  }

  loadCamps(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.campService.getCamps().subscribe({
      next: (camps) => {
        this.camps = camps;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los campamentos: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  onDeleteCamp(id: number): void {
    if (!confirm('¿Está seguro de que desea eliminar este campamento?')) {
      return;
    }

    this.isLoading = true;
    this.campService.deleteCamp(id).subscribe({
      next: () => {
        this.camps = this.camps.filter((camp) => camp.id !== id);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar el campamento: ' + error.message;
        this.isLoading = false;
      },
    });
  }
}

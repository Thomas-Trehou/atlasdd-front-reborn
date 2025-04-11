import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    // Convertir en objet Date si c'est une chaîne
    const date = typeof value === 'string' ? new Date(value) : value;

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return '';

    // Formatter la date comme "JJ/MM/AAAA"
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}

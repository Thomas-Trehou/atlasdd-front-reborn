import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) {}

  navigateToCreateOgl5(): void {
    this.router.navigate(['/characters/create/ogl5']);
  }

  navigateToCreateCustom(): void {
    this.router.navigate(['/characters/create/custom']);
  }

}

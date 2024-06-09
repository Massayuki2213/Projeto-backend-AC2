import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  totalUsers: number = 5; 
  userRoles: any[] = [ 
    { name: 'Engenheiro de FE', count: 1 },
    { name: 'Engenheiro de BE', count: 2 },
    { name: 'Analista de Dados', count: 1 },
    { name: 'Líder Técnico', count: 1 }
  ];
}

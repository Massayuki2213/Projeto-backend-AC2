import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  constructor(private router: Router) { }
  user = [
    { nome: 'Ana', email: 'ana@example.com', senha: 'senha123',  funcao: 'Engenheiro de FE' },
    { nome: 'Carlos', email: 'carlos@example.com', senha: 'senha123',  funcao: 'Engenheiro de BE' },
    { nome: 'Diego', email: 'carlos@example.com', senha: 'senha123',  funcao: 'Analista de dados' },
    { nome: 'Leonardo', email: 'carlos@example.com', senha: 'senha123',  funcao: 'Líder Técnico' },
    { nome: 'Maria', email: 'carlos@example.com', senha: 'senha123',  funcao: 'Engenheiro de BE' }
  ];

  usuarioSelecionado: any;


  editarUsuario(user: any): void{
    this.usuarioSelecionado = user;
    this.router.navigate(['/app/editUser', { user: JSON.stringify(user) }]); // Supondo que o ID do usuário seja 'id'
  }

  salvarEdicao(user: any) {
    user.editing = false;
  }

  deletarUsuario(user: any) {
    const index = this.user.indexOf(user);
    if (index !== -1) {
      this.user.splice(index, 1);
    }
  }

  incluirUsuario() {
    this.router.navigate(['/app/addUser']);
  }
}

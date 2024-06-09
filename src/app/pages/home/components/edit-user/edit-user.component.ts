import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user = {
    nome: '',
    email: '',
    funcao: '',
    senha: ''
  };

  senhaInvalida: boolean = false;
  
  

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Extrair os parâmetros da rota para obter o usuário selecionado
    this.route.params.subscribe(params => {
      const userString = params['user'];
      if (userString) {
        this.user = JSON.parse(userString);
      }
    });
  }

  submitForm() {
    if (this.user.nome && this.user.email && this.user.funcao && this.user.senha && !this.senhaInvalida) {
      // Aqui você pode enviar os dados do usuário para o servidor ou fazer o que for necessário
      console.log('Usuário enviado:', this.user);
      // Limpa o formulário após o envio
      // this.user = {
      //   nome: '',
      //   email: '',
      //   cargo: '',
      //   senha: ''
      // };
      // Alerta de usuário cadastrado corretamente
      alert('Usuário atualizado corretamente!\n' + `\nNome: ${this.user.nome}\nEmail: ${this.user.email}\nFunção: ${this.user.funcao}\nSenha: ${this.user.senha}`);
      
      this.router.navigate(['/app/users']);
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  checkSenha() {
    this.senhaInvalida = this.user.senha.length < 6 || this.user.senha.length > 15;
  }
}

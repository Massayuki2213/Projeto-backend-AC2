import { Component } from '@angular/core';

interface Task {
  id: number;
  description: string;
  status: string;
  editing: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  tasks: Task[] = [
    { id: 1, description: 'Tarefa 1', status: 'Não iniciado', editing: false },
    { id: 2, description: 'Tarefa 2', status: 'Não iniciado', editing: false },
    { id: 3, description: 'Tarefa 3', status: 'Não iniciado', editing: false },
    { id: 4, description: 'Tarefa 4', status: 'Não iniciado', editing: false },
    { id: 5, description: 'Tarefa 5', status: 'Não iniciado', editing: false }
  ];


  botaoConcluir(task: Task): void {
    if (task.status === 'Não iniciado') {
      task.status = 'Em andamento';
    } else if (task.status === 'Em andamento') {
      task.status = 'Concluído';
    } else if (task.status === 'Concluído') {
      task.status = 'Não iniciado';
    }
  }

  editarTarefa(task: Task): void {
    task.editing = !task.editing;
  }

  salvarEdicao(task: Task): void {
    task.editing = false;
  }

  deletarTarefa(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  incluirTarefa(): void {
    const novaTarefa: Task = {
      id: this.getNextId(),
      description: '',
      status: 'Não iniciado',
      editing: true
    };
    this.tasks.push(novaTarefa);
  }

  podeIncluirTarefa(): boolean {
    return this.tasks.every(task => !task.editing);
  }

  private getNextId(): number {
    return this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id)) + 1 : 1;
  }
}
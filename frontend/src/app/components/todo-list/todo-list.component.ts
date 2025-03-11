import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Todo = {
    title: '',
    description: '',
    completed: false
  };

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getAllTodos().subscribe(
      (data) => {
        this.todos = data;
      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }

  addTodo(): void {
    if (this.newTodo.title.trim()) {
      this.todoService.createTodo(this.newTodo).subscribe(
        (data) => {
          this.todos.push(data);
          this.newTodo = {
            title: '',
            description: '',
            completed: false
          };
        },
        (error) => {
          console.error('Error adding todo:', error);
        }
      );
    }
  }

  deleteTodo(id: number | undefined): void {
    if(id !== undefined) {
      this.todoService.deleteTodo(id).subscribe(
        () => {
          this.todos = this.todos.filter(todo => todo.id !== id);
        },
        (error) => {
          console.error('Error deleting todo:', error);
        }
      );
    }
    
  }

  toggleCompleted(todo: Todo): void {
    if(todo.id !== undefined) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.todoService.updateTodo(todo.id, updatedTodo).subscribe(
      (data) => {
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = data;
        }
      },
      (error) => {
        console.error('Error updating todo:', error);
      }
    );
  } else {
    console.error("Cannot update todo without an ID");
  }
 }
}
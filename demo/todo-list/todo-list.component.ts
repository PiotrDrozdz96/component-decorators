import _isEmpty from 'lodash/isEmpty';
import { Component, State, Ref, On, WebArray, Context } from 'decorators';

import { LOADER_PROVIDER, LoaderProvider } from '../providers/loader/loader.consumer';

import messages from './todo-list.messages';
import template from './todo-list.component.html';
import { createItem, createCompletedItem } from './todo-list.utils';
import './todo-list.component.scss';

@Component({ selector: 'app-todo-list', template })
export default class TodoListElement extends HTMLElement {
  readonly messages = messages;

  @Ref('input') $input: HTMLInputElement;
  @Context(LOADER_PROVIDER) loaderProvider: LoaderProvider;

  @WebArray('[todoList]', createItem)
  @State({ 'web-if[isEmptyList].condition': _isEmpty })
  public taskList: Array<string> = [];

  @WebArray('[completedTask]', createCompletedItem)
  @State({ '[completedTaskCounter]': messages.completedTask })
  public completedTaskList: Array<string> = [];

  connectedCallback() {
    this.loaderProvider.loading.next(true);
    setTimeout(() => {
      this.loaderProvider.loading.next(false);
    }, 1000);
  }

  public removeTask = (item: string) => {
    this.taskList.splice(this.taskList.indexOf(item), 1);
  };

  public completeTask = (item: string) => {
    const [completedTask] = this.taskList.splice(this.taskList.indexOf(item), 1);
    this.completedTaskList.push(completedTask);
  };

  @On('[addTask]', 'onclick')
  public addTask() {
    if (this.$input.value) {
      this.taskList.push(this.$input.value);
      this.$input.value = '';
    }
  }
}

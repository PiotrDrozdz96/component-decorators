import _isEmpty from 'lodash/isEmpty';
import _filter from 'lodash/filter';
import _find from 'lodash/find';
import { Component,  Ref, On, Context, Prop, Subscription, State } from 'decorators';

import { LOADER_PROVIDER, LoaderProvider } from '../providers/loader/loader.consumer';
import WebForDirective from 'directivities/web-for';
import Observable from 'helpers/Observable';

import messages from './todo-list.messages';
import template from './todo-list.component.html';
import './todo-list.component.scss';

type Task = {
  id: number;
  name: string;
};

@Component({ selector: 'app-todo-list', template })
export default class TodoListElement extends HTMLElement {
  readonly messages = messages;

  @Context(LOADER_PROVIDER) loaderProvider: LoaderProvider;
  @Ref('input') $input: HTMLInputElement;
  @Ref('[todoList]') $taskList: WebForDirective<Task>;

  @State('[completedTaskCounter]') completedTaskCounter: string;
  @State('[isEmptyList].condition') isEmptyList: boolean;
  @Prop('[completedTask]', 'collection') completedTaskList: Observable<Task[]>;

  connectedCallback() {
    this.loaderProvider.loading.next(true);

    this.$taskList.initChild = ($child) => {
      const key = $child.getAttribute('key');
      ($child.querySelector('[remove]') as HTMLButtonElement).onclick = () => this.removeTask(Number(key));
      ($child.querySelector('[completed]') as HTMLButtonElement).onclick = () => this.completeTask(Number(key));
    };

    setTimeout(() => {
      this.loaderProvider.loading.next(false);
    }, 1000);
  }

  @Subscription()
  public observeCompletedTaskList() {
    return this.completedTaskList.subscribe((collection) => {
      this.completedTaskCounter = messages.completedTask(collection.length);
    }, true)
  }

  @Subscription()
  public observeTaskList() {
    return this.$taskList.collection.subscribe((collection) => {
      this.isEmptyList = _isEmpty(collection);
    }, true)
  }

  public removeTask = (key: number) => {
    this.$taskList.collection.next(_filter(this.$taskList.collection.get(), ({ id }) => id !== key))
  };

  public completeTask = (key: number) => {
    const list = this.$taskList.collection.get();
    const completedTask = _find(list, { id: key }) as Task;
    this.removeTask(key);
    this.completedTaskList.next([...this.completedTaskList.get(), completedTask])
  };

  @On('[addTask]', 'onclick')
  public addTask() {
    if (this.$input.value) {
      this.$taskList.collection.next([...this.$taskList.collection.get(), { id: Math.random(), name: this.$input.value}]);
      this.$input.value = '';
    }
  }
}

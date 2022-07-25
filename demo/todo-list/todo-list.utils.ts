/* eslint-disable func-names */
import _ce from 'helpers/createElement';

import messages from './todo-list.messages';

// function itemRerender(item, index) {
//   if (this.index !== index) {
//     this.querySelector('span').innerHTML = `${item}--${index}`;
//   }
// }

export function createItem(item: string) {
  return (
    _ce('li', null, [
      _ce('span', { innerHTML: item }),
      _ce('button', { onclick: () => this.removeTask(item),
        innerHTML: messages.remove,
      }),
      _ce('button', { onclick: () => this.completeTask(item),
        innerHTML: messages.completed,
      }),
    ])
  );
}

export function createCompletedItem(item: string) {
  return _ce('li', { innerHTML: item });
}

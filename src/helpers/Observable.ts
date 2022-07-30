import _uniqueId from 'lodash/uniqueId';
import _forEach from 'lodash/forEach';

type DataListener<T> = (data: T, oldData: T) => void;

interface DataListeners<T> {
  [key: string]: DataListener<T>,
}

class Observable<T> {
  private _dataListeners: DataListeners<T> = {};

  constructor(private data: T) {}

  public subscribe(dataListener: DataListener<T>, runInit?: boolean): () => void {
    const id = _uniqueId('observable');
    this._dataListeners[id] = dataListener;

    if (runInit) {
      setTimeout(() => {
        dataListener(this.data, undefined);
      });
    }

    return () => { delete this._dataListeners[id]; };
  }

  public next(data: T) {
    if (data !== this.data) {
      const oldData = this.data;
      this.data = data;
      _forEach(this._dataListeners, (dataListener) => {
        dataListener(data, oldData);
      });
    }
  }

  public get(): T {
    return this.data;
  }
}

export default Observable;

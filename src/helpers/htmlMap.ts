import _join from 'lodash/join';
import _map from 'lodash/map';

const htmlMap = (collection: Array<unknown>, iteratee): string => (
  _join(_map(collection, iteratee), '')
);

export default htmlMap;

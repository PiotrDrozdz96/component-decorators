import Observable from 'helpers/Observable';

export const LOADER_PROVIDER = 'app-loader-provider';

export interface LoaderProvider {
  loading: Observable<boolean>,
}

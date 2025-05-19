import { Observable } from 'rxjs';
import { fromObservable } from './from-observable';

export const formatResponse = async <T>(data: T | Observable<T>) => {
  return {
    success: true,
    data: await fromObservable(data),
  };
};

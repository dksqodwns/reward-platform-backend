import { firstValueFrom, Observable } from 'rxjs';

export const fromObservable = <T>(data: T | Observable<T>) => {
  if (data instanceof Observable) {
    return firstValueFrom(data as Observable<any>);
  } else {
    return data;
  }
};

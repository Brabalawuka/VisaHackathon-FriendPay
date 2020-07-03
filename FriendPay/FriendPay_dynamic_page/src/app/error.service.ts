import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private error: Error = new Error('Page not found.');

  constructor() { }

  getError(){
    return this.error;
  }

  setError(err){
    this.error = err;
  }
}

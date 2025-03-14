import { Injectable } from '@angular/core';
import {UserLight} from '../../core/models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser?: UserLight

  constructor() { }
}

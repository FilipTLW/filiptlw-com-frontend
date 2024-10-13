import { Injectable } from '@angular/core';
import axios from 'axios';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor() { }

  async loginWithGithub(): Promise<void> {
    const clientID = await axios.get<string>(`${environment.apiUrl}/login/github/clientID`);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID.data}`;
  }

  async submitGithubCode(code: string): Promise<void> {
    await axios.post(`${environment.apiUrl}/login/github/login`, {
      code: code
    });
  }
}

import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ClientIdResponse, UserProfile} from '../utils/models/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }

  async loginWithGithub(): Promise<void> {
    const clientID = await firstValueFrom(this.http.get<ClientIdResponse>(`${environment.apiUrl}/auth/github/clientID`));
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID.clientId}`;
  }

  async submitGithubCode(code: string): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/github/login`, {
      code: code
    }, {
      withCredentials: true
    }));
  }

  async getProfile(): Promise<UserProfile> {
    return await firstValueFrom(this.http.get<UserProfile>(`${environment.apiUrl}/auth/profile`, {
      withCredentials: true
    }));
  }
}

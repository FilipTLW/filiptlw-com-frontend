import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Page} from '../../utils/models/page';

@Injectable({
  providedIn: 'root'
})
export class UserPageService {

  constructor(private http: HttpClient) { }

  async getRootPage(entry: number): Promise<Page | null> {
    try {
      return await firstValueFrom(this.http.get<Page>(`${environment.apiUrl}/page/rootPage?entry=${entry}`));
    } catch {
      return null;
    }
  }
}

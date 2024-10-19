import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Page} from '../../utils/models/page';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  async getHomePage(): Promise<Page> {
    return firstValueFrom(this.http.get<Page>(`${environment.apiUrl}/page/home`));
  }
}

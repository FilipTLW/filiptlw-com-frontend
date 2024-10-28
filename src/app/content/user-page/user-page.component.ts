import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {UserPageService} from './user-page.service';
import {Page} from '../../utils/models/page';
import {PageComponent} from '../page/page.component';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    PageComponent
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit{
  type?: 'root' | 'user';
  entry?: number;
  page?: Page | null
  loading: boolean = true;

  constructor(private _activatedRoute: ActivatedRoute, private _userPageService: UserPageService) {
  }

  async ngOnInit() {
    this.loading = true;
    const data = await firstValueFrom(this._activatedRoute.data);
    this.type = data['type'];
    const params = await firstValueFrom(this._activatedRoute.params);
    this.entry = parseInt(params['entry']);

    if (this.type === 'root') {
      this.page = await this._userPageService.getRootPage(this.entry);
      this.loading = false;
    }
  }
}

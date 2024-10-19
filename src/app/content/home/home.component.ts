import {Component, OnInit} from '@angular/core';
import {HomeService} from './home.service';
import {Page} from '../../utils/models/page';
import {PageComponent} from '../page/page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PageComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit
{
  page?: Page;

  constructor(private _homeService: HomeService) { }

  async ngOnInit(): Promise<void> {
    try {
      this.page = await this._homeService.getHomePage();
    } catch {}
  }


}

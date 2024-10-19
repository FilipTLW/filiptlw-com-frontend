import {Component, Input} from '@angular/core';
import {Page} from '../../utils/models/page';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  @Input() page?: Page;
}

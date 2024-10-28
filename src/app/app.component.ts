import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppService} from './app.service';
import {TerminalComponent} from './terminal/terminal.component';
import {PageFileSystemService} from './page-file-system/page-file-system.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TerminalComponent],
  providers: [AppService, PageFileSystemService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  ezMode: boolean = false;

  constructor(private _appService: AppService) {
  }

  ngOnInit(): void {
      this.ezMode = this._appService.getEzMode();
      this._appService.ezMode$.subscribe((ezMode) => this.ezMode = ezMode);
  }


}

import { Component } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoginService} from '../login.service';

@Component({
  selector: 'app-github-login',
  standalone: true,
  imports: [],
  templateUrl: './github-login.component.html',
  styleUrl: './github-login.component.scss'
})
export class GithubLoginComponent {
  constructor(private _activatedRoute: ActivatedRoute, private _loginService: LoginService) {
    this._activatedRoute.queryParams.subscribe(async (queryParams: Params) => {
      if (queryParams['code']) {
        await this._loginService.submitGithubCode(queryParams['code']);
        window.location.href = `/`;
      }
    });
  }
}

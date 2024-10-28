import { Routes } from '@angular/router';
import {HomeComponent} from './content/home/home.component';
import {GithubLoginComponent} from './login/github-login/github-login.component';
import {UserPageComponent} from './content/user-page/user-page.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login/github', component: GithubLoginComponent},
  {path: 'root/:entry', component: UserPageComponent, data: {type: 'root'}},
];

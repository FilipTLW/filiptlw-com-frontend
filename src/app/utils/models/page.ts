import {Observable} from "rxjs";

export type PageFile = {
  path: string;
  type: 'static';
  children: PageFile[];
} | {
  path: string;
  type: 'generated';
  children: PageFile[];
  generator: () => Observable<PageFile[]>;
}

export class PageFilePathDoesNotExistError extends Error {}

export enum PageType {
  HOME = 'home',
  USER = 'user'
}

export type Page = {
  id: number;
  page_type: PageType;
  title: string;
  subtitle?: string;
  header?: string;
  sections: PageSection[];
  footer?: string;
}

export type PageSection = {
  id: number;
  page: Page;
  title: string;
  content: string;
}

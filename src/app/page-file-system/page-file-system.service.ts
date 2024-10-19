import { Injectable } from '@angular/core';
import {PageFile, PageFilePathDoesNotExistError} from '../utils/models/page';
import {firstValueFrom, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageFileSystemService {

  root: PageFile = {
    path: '',
    type: 'static',
    children: []
  };

  constructor() {
    this.registerStaticPage('root');
    this.registerGeneratedPage('root/entry*', () => {
      return of([
        {
          path: '1',
          type: 'static',
          children: []
        },
        {
          path: '2',
          type: 'static',
          children: []
        },
        {
          path: '3',
          type: 'static',
          children: []
        }
      ]);
    });
    console.log(this.root);
    this.listChildren('').then(children => console.log(children));
  }

  registerStaticPage(path: string) {
    const splitPath = path.split('/');
    let current = this.root;
    for (const pathSegment of splitPath) {
      let child = current.children.find(child => child.path === pathSegment);
      if (!child) {
        child = {
          path: pathSegment,
          type: 'static',
          children: []
        }
        current.children.push(child);
      }
      current = child;
    }
  }

  registerGeneratedPage(path: string, generator: () => Observable<PageFile[]>) {
    const splitPath = path.split('/');
    let current = this.root;
    for (const pathSegment of splitPath.slice(0, splitPath.length - 1)) {
      let child = current.children.find(child => child.path === pathSegment);
      if (!child) {
        child = {
          path: pathSegment,
          type: 'static',
          children: []
        }
        current.children.push(child);
      }
      current = child;
    }
    current.children.push({
      path: splitPath[splitPath.length - 1],
      type: 'generated',
      children: [],
      generator: generator
    })
  }

  async listChildren(path: string): Promise<PageFile[]> {
    const splitPath = path.split('/');
    let current = this.root;
    if (splitPath[0] !== '') {
      for (const pathSegment of splitPath) {
        const child = current.children.find(child => child.path === pathSegment);
        if (!child) {
          throw new PageFilePathDoesNotExistError();
        }
        current = child;
      }
    }
    const ret: PageFile[] = [];
    for (const child of current.children) {
      if (child.type === 'static') {
        ret.push(child);
      } else if (child.type === 'generated') {
        const pages = await firstValueFrom(child.generator());
        pages.forEach(page => page.path = child.path.replace('*', page.path));
        ret.push(...pages);
      }
    }
    return ret;
  }
}

import { TestBed } from '@angular/core/testing';

import { PageFileSystemService } from './page-file-system.service';

describe('PageFileSystemService', () => {
  let service: PageFileSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageFileSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

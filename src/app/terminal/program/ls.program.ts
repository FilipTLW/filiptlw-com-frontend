import {Program} from './program';
import {PageFileSystemService} from '../../page-file-system/page-file-system.service';
import {TerminalHelper} from '../../utils/terminal';
import {PageFile} from '../../utils/models/page';

export class LSProgram extends Program{
  private _pageFileSystemService = this._programServiceInjector.inject(PageFileSystemService);

  override async initialize() {
    const args = this.args.split(' ').filter(arg => arg !== '');
    try {
      if (args.length === 0) {
        const pages = await this._pageFileSystemService.listChildren('');
        this.printPages(pages);
      } else if (args.length === 1) {
        const pages = await this._pageFileSystemService.listChildren(args[0]);
        this.printPages(pages);
      }
    } catch {
      TerminalHelper.println(this.terminal, 'Invalid Path');
    }

    this.exit();
  }

  override onData(input: string) { }

  printPages(pages: PageFile[]) {
    pages.forEach(page => {
      TerminalHelper.println(this.terminal, page.path);
    });
  }
}

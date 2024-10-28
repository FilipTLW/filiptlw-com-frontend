import {Program} from './program';
import {FunctionsUsingCSI} from 'ng-terminal';
import {firstValueFrom, Observable, Subject} from 'rxjs';
import {EchoProgram} from './echo.program';
import {TerminalHelper} from '../../utils/terminal';
import {HelpProgram} from './help.program';
import {EzModeProgram} from './ezmode.program';
import {LoginProgram} from './login.program';
import {TerminalService} from '../terminal.service';
import {ProfileProgram} from './profile.program';
import {LogoutProgram} from './logout.program';
import {LSProgram} from './ls.program';
import {convertBrowserOptions} from '@angular-devkit/build-angular/src/builders/browser-esbuild';

export class ShellProgram extends Program {
  readonly _terminalService: TerminalService = this._programServiceInjector.inject(TerminalService);

  subProgram?: Program;

  inputAcceptor: TerminalHelper.InputAcceptor = new TerminalHelper.InputAcceptor(this.terminal);
  isRunning: boolean = true;

  public override initialize(): void {
    this.terminal.write(this._terminalService.getPrefix());
    this._exit.asObservable().subscribe(() => this.isRunning = false);
    new Promise<void>(async resolve => {
      while (this.isRunning) {
        const input = await this.inputAcceptor.readLine();
        const separatorIdx: number = input.indexOf(' ');
        const command: string = separatorIdx > 0 ? input.substring(0, separatorIdx) : input;
        const args: string = separatorIdx > 0 ? input.substring(separatorIdx + 1) : '';
        this.executeSubProgram(command, args).then(async () => {
          await TerminalHelper.asyncPrint(this.terminal, this._terminalService.getPrefix());
        });
      }
      resolve();
    }).then();
  }

  override async onData(input: string): Promise<void> {
    if (this.subProgram !== undefined) {
      await this.subProgram.onData(input);
      return;
    }
    await this.inputAcceptor.consume(input);
  }

  override exit(): void {}

  async executeSubProgram(program: string, args: string): Promise<void> {
    const subExit: Subject<void> = new Subject<void>();
    const subExit$: Observable<void> = subExit.asObservable();
    const subExitPromise: Promise<void> = firstValueFrom(subExit$);
    switch (program) {
      case 'echo':
        this.subProgram = new EchoProgram(this.terminal, subExit, this._programServiceInjector, args);
        break;
      case 'help':
      case 'man':
        this.subProgram = new HelpProgram(this.terminal, subExit, this._programServiceInjector, args);
        break;
      case 'ezmode':
        this.subProgram = new EzModeProgram(this.terminal, subExit, this._programServiceInjector, args);
        break;
      case 'login':
        this.subProgram = new LoginProgram(this.terminal, subExit, this._programServiceInjector, args);
        break;
      case 'profile':
        this.subProgram = new ProfileProgram(this.terminal, subExit, this._programServiceInjector, args);
        break;
      case 'logout':
        this.subProgram = new LogoutProgram(this.terminal, subExit, this._programServiceInjector, args);
        break;
      case 'ls':
        this.subProgram = new LSProgram(this.terminal, subExit, this._programServiceInjector, args);
        break;
      default:
        subExit.next();
        break;
    }
    this.subProgram?.initialize();
    await subExitPromise;
    this.subProgram = undefined;
  }

}

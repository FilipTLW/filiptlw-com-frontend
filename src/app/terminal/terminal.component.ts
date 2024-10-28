import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {NgTerminal, NgTerminalModule} from 'ng-terminal';
import {TerminalService} from './terminal.service';
import {Program} from './program/program';
import {ShellProgram} from './program/shell.program';
import {Observable, Subject} from 'rxjs';
import {TerminalHelper} from '../utils/terminal';
import {AppService} from '../app.service';
import {LoginService} from '../login/login.service';
import {ProgramServiceInjector, PROVIDER_TOKEN} from './program/program-service-injector';
import {PageFileSystemService} from '../page-file-system/page-file-system.service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [
    NgTerminalModule
  ],
  providers: [
    {
      provide: PROVIDER_TOKEN,
      useValue: [TerminalService, AppService, LoginService, PageFileSystemService]
    },
    ProgramServiceInjector
  ],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent implements AfterViewInit {
  @ViewChild('terminal') terminal!: NgTerminal;

  private currentProgram?: Program;
  private programExited: Subject<void> = new Subject<void>();
  private programExited$: Observable<void> = this.programExited.asObservable();

  private cache: string[] = [];
  private dataStreaming: boolean = false;

  constructor(private _terminalService: TerminalService, private _appService: AppService, private _loginService: LoginService, private _programServiceInjector: ProgramServiceInjector) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this._loginService.updateProfile();
    TerminalHelper.println(this.terminal, this._terminalService.getMOTD());

    this.currentProgram = new ShellProgram(this.terminal, this.programExited, this._programServiceInjector);
    this.currentProgram.initialize();
    this.programExited$.subscribe(() => {
      this.currentProgram?.kill();
      this.currentProgram = new ShellProgram(this.terminal, this.programExited, this._programServiceInjector);
      this.currentProgram.initialize();
    });

    this.terminal.onData().subscribe(async (input: string) => {
      if (input === '\x16') { // Ctrl+V (paste clipboard)
        this.cache.push(await navigator.clipboard.readText());
      } else {
        this.cache.push(input);
      }
      if (!this.dataStreaming) {
        this.dataStreaming = true;
        while (this.cache.length > 0) {
          await this.currentProgram?.onData(this.cache.pop()!);
        }
        this.dataStreaming = false;
      }
    });
  }

}

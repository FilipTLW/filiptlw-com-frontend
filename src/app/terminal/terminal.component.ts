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

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [
    NgTerminalModule
  ],
  providers: [
    {
      provide: PROVIDER_TOKEN,
      useValue: [TerminalService, AppService, LoginService]
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

  constructor(private _terminalService: TerminalService, private _appService: AppService, private _loginService: LoginService, private _programServiceInjector: ProgramServiceInjector) {
  }

  ngAfterViewInit(): void {
    TerminalHelper.println(this.terminal, this._terminalService.getMOTD());

    this.currentProgram = new ShellProgram(this.terminal, this.programExited, this._programServiceInjector);
    this.currentProgram.initialize();
    this.programExited$.subscribe(() => {
      this.currentProgram?.kill();
      this.currentProgram = new ShellProgram(this.terminal, this.programExited, this._programServiceInjector);
      this.currentProgram.initialize();
    });

    this.terminal.onData().subscribe((input: string) => {
      this.currentProgram?.onData(input);
    });
  }

}

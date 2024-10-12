import {Program} from './program';
import {FunctionsUsingCSI} from 'ng-terminal';
import {firstValueFrom, Observable, Subject} from 'rxjs';
import {EchoProgram} from './echo.program';
import {TerminalHelper} from '../../utils/terminal';
import {HelpProgram} from './help.program';
import {EzModeProgram} from './ezmode.program';

export class ShellProgram extends Program {
  buffer: string = '';
  bufferPtr: number = 0;

  subProgram?: Program;

  override initialize(): void {
    this.terminal.write(this._terminalService.getPrefix());
  }

  override async onData(input: string): Promise<void> {
    if (this.subProgram !== undefined) return;
    switch (input) {
      // arrow LEFT
      case '\x1b[D':
        if (this.terminal.underlying!.buffer.active.cursorX > this._terminalService.getRawPrefix().length) {
          this.bufferPtr--;
          this.terminal.write(input);
        }
        break;
      // arrow RIGHT
      case '\x1b[C':
        if (this.terminal.underlying!.buffer.active.cursorX < this._terminalService.getRawPrefix().length + this.buffer.length) {
          this.bufferPtr++;
          this.terminal.write(input);
        }
        break;
      // arrow DOWN
      case '\x1b[B':
        // TODO arrow down, history
        break;
      // arrow UP
      case '\x1b[A':
        // TODO arrow up, history
        break;
      // ENTER
      case '\r':
        // TODO execute command
        TerminalHelper.println(this.terminal);
        const separatorIdx: number = this.buffer.indexOf(' ');
        const command: string = separatorIdx > 0 ? this.buffer.substring(0, separatorIdx) : this.buffer;
        const args: string = separatorIdx > 0 ? this.buffer.substring(separatorIdx + 1) : '';
        await this.executeSubProgram(command, args)
        this.buffer = '';
        this.bufferPtr = 0;
        this.terminal.write(this._terminalService.getPrefix());
        break;
      // BACKSPACE
      case '\u007f':
        // check if cursor is not at the start of input
        if (this.terminal.underlying!.buffer.active.cursorX > this._terminalService.getRawPrefix().length) {
          this.terminal.write('\b \b'); // delete character
          this.terminal.write(this.buffer.substring(this.bufferPtr)); // move remaining text
          this.terminal.write('\x1b[0K'); // clear everything after the buffer
          this.terminal.write(FunctionsUsingCSI.cursorColumn(this._terminalService.getRawPrefix().length + this.bufferPtr)); // reset cursor back to the position of bufferPtr
          this.buffer = this.buffer.substring(0, this.bufferPtr - 1) + this.buffer.substring(this.bufferPtr); // remove the character from the buffer
          this.bufferPtr--;
        }
        break;
      default:
        // check if character is printable
        if (!((input.match(/[^ -~]+/g) ?? []).length > 0)) {
          this.terminal.write(input);
          this.terminal.write(this.buffer.substring(this.bufferPtr)); // move the text after the inserted character
          this.terminal.write(FunctionsUsingCSI.cursorColumn(this._terminalService.getRawPrefix().length + this.bufferPtr + 2)); // reset cursor back to the position of bufferPtr
          this.buffer = this.buffer.substring(0, this.bufferPtr) + input + this.buffer.substring(this.bufferPtr); // insert character into the buffer
          this.bufferPtr++;
        }
        break;
    }
  }

  override exit(): void {}

  async executeSubProgram(program: string, args: string): Promise<void> {
    const subExit: Subject<void> = new Subject<void>();
    const subExit$: Observable<void> = subExit.asObservable();
    const subExitPromise: Promise<void> = firstValueFrom(subExit$);
    switch (program) {
      case 'echo':
        this.subProgram = new EchoProgram(this.terminal, subExit, this._terminalService, this._appService, args);
        break;
      case 'help':
        this.subProgram = new HelpProgram(this.terminal, subExit, this._terminalService, this._appService, args);
        break;
      case 'ezmode':
        this.subProgram = new EzModeProgram(this.terminal, subExit, this._terminalService, this._appService, args);
        break;
    }
    await subExitPromise;
    this.subProgram = undefined;
  }

}

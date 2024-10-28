import {FunctionsUsingCSI, NgTerminal} from 'ng-terminal';
import {firstValueFrom, Subject} from 'rxjs';

export namespace TerminalHelper {
  export function println(terminal: NgTerminal, text: string = ''): void {
    terminal.write(text);
    terminal.write('\n');
    terminal.write(FunctionsUsingCSI.cursorColumn(1));
  }

  export async function asyncPrint(terminal: NgTerminal, text: string = ''): Promise<void> {
    return new Promise(resolve => {
      terminal.underlying?.write(text, () => {
        resolve();
      });
    });
  }

  export class InputAcceptor {
    private buffer: string = '';
    private bufferPtr: number = 0;
    private readonly terminal: NgTerminal;

    private readonly done: Subject<void> = new Subject();
    private accepting: boolean = false;

    constructor(terminal: NgTerminal) {
      this.terminal = terminal;
    }

    async readLine() {
      if (this.accepting) {
        throw new Error('Tried to listen for input while listening for input already.');
      }
      this.buffer = '';
      this.bufferPtr = 0;
      this.accepting = true;
      await firstValueFrom(this.done.asObservable());
      this.accepting = false;
      return this.buffer;
    }

    async consume(input: string): Promise<boolean> {
      if (!this.accepting) {
        return false;
      }
      switch (input) {
        // arrow LEFT
        case '\x1b[D':
          if (this.bufferPtr > 0) {
            this.bufferPtr--;
            await TerminalHelper.asyncPrint(this.terminal, input);
          }
          break;
        // arrow RIGHT
        case '\x1b[C':
          if (this.bufferPtr < this.buffer.length) {
            this.bufferPtr++;
            await TerminalHelper.asyncPrint(this.terminal, input);
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
          TerminalHelper.println(this.terminal);
          this.done.next();
          break;
        // BACKSPACE
        case '\u007f':
          // check if cursor is not at the start of input
          if (this.bufferPtr > 0) {
            if (this.terminal.underlying!.buffer.active.cursorX <= 0) {
              await TerminalHelper.asyncPrint(this.terminal, FunctionsUsingCSI.cursorUp(1) + FunctionsUsingCSI.cursorColumn(this.terminal.underlying!.cols));
            } else {
              this.terminal.write('\b');
            }
            const [x, y] = [this.terminal.underlying!.buffer.active.cursorX, this.terminal.underlying!.buffer.active.cursorY];
            await TerminalHelper.asyncPrint(this.terminal, FunctionsUsingCSI.deleteCharacter(8192) + FunctionsUsingCSI.cursorDown(1) + FunctionsUsingCSI.deleteLines(2000) + FunctionsUsingCSI.cursorPosition(y + 1, x + 1));
            await TerminalHelper.asyncPrint(this.terminal, this.buffer.substring(this.bufferPtr) + FunctionsUsingCSI.cursorPosition(y + 1, x + 1));
            this.buffer = this.buffer.substring(0, this.bufferPtr - 1) + this.buffer.substring(this.bufferPtr); // remove the character from the buffer
            this.bufferPtr--;
          }
          break;
        default:
          // check if character is printable
          if (!((input.match(/[^ -~]+/g) ?? []).length > 0)) {
            await TerminalHelper.asyncPrint(this.terminal, input);
            let [x, y] = [this.terminal.underlying!.buffer.active.cursorX, this.terminal.underlying!.buffer.active.cursorY];
            if (this.terminal.underlying!.buffer.active.cursorX >= this.terminal.underlying!.cols) {
              await TerminalHelper.asyncPrint(this.terminal, FunctionsUsingCSI.cursorDown(1) + FunctionsUsingCSI.cursorColumn(0));
              x = 0;
              y++;
            }
            await TerminalHelper.asyncPrint(this.terminal, FunctionsUsingCSI.deleteCharacter(8192) + FunctionsUsingCSI.cursorDown(1) + FunctionsUsingCSI.deleteLines(2000) + FunctionsUsingCSI.cursorPosition(y + 1, x + 1));
            await TerminalHelper.asyncPrint(this.terminal, this.buffer.substring(this.bufferPtr) + FunctionsUsingCSI.cursorPosition(y + 1, x + 1));
            this.buffer = this.buffer.substring(0, this.bufferPtr) + input + this.buffer.substring(this.bufferPtr); // insert character into the buffer
            this.bufferPtr++;
          }
          break;
      }
      return true;
    }
  }
}

import {Program} from './program';

export class LoginProgram extends Program {

  protected override initialize() {
    const args = this.args.split(' ').filter(arg => arg !== '');
    if (args.length === 1) {
      switch (args[0]) {
        case 'github':
          this._loginService.loginWithGithub().then();
          break;
      }
    }
    this.exit();
  }

  override onData(input: string): void {}

}

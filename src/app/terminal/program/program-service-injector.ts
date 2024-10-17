import {inject, Injectable, InjectionToken, Provider} from '@angular/core';

export const PROVIDER_TOKEN = new InjectionToken<InjectionToken<Provider>[]>('PROVIDER_TOKEN');

@Injectable({
  providedIn: 'root'
})
export class ProgramServiceInjector {
  providers: {[token: string]: Provider} = {};

  constructor() {
    const providers = inject(PROVIDER_TOKEN);
    providers.forEach(provider => {
      const service = inject(provider);
      this.registerService(provider, service);
    });
  }

  registerService(token: InjectionToken<Provider>, provider: Provider) {
    this.providers[token.toString()] = provider;
  }

  inject<T>(token: { new(...args: any): T }): T {
    return this.providers[token.toString()] as T;
  }
}

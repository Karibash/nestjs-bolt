import { DynamicModule, OnModuleDestroy, OnModuleInit, Type } from '@nestjs/common';
import { AppOptions } from '@slack/bolt';

import { SLACK_MODULE_OPTIONS } from './constants';
import { SlackDriver } from './slack.driver';

export interface SlackModuleOptions {
  driver: Type<SlackDriver>;
  processBeforeResponse?: AppOptions['processBeforeResponse'];
  signatureVerification?: AppOptions['signatureVerification'];
  clientId?: AppOptions['clientId'];
  clientSecret?: AppOptions['clientSecret'];
  stateSecret?: AppOptions['stateSecret'];
  redirectUri?: AppOptions['redirectUri'];
  installationStore?: AppOptions['installationStore'];
  scopes?: AppOptions['scopes'];
  installerOptions?: AppOptions['installerOptions'];
  agent?: AppOptions['agent'];
  clientTls?: AppOptions['clientTls'];
  convoStore?: AppOptions['convoStore'];
  token?: AppOptions['token'];
  botId?: AppOptions['botId'];
  botUserId?: AppOptions['botUserId'];
  authorize?: AppOptions['authorize'];
  receiver?: AppOptions['receiver'];
  logger?: AppOptions['logger'];
  logLevel?: AppOptions['logLevel'];
  ignoreSelf?: AppOptions['ignoreSelf'];
  clientOptions?: AppOptions['clientOptions'];
  tokenVerificationEnabled?: AppOptions['tokenVerificationEnabled'];
  extendedErrorHandler?: AppOptions['extendedErrorHandler'];
}

export class SlackModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly driver: SlackDriver,
  ) {}

  static forRoot<T extends SlackModuleOptions>(options: T): DynamicModule {
    return {
      module: SlackModule,
      providers: [
        {
          provide: SLACK_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: SlackDriver,
          useClass: options.driver,
        },
      ],
    };
  }

  public async onModuleInit(): Promise<void> {
    await this.driver.start();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.driver.stop();
  }
}

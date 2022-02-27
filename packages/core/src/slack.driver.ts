import { HttpAdapterHost, Inject } from '@nestjs/common';
import { App, Receiver } from '@slack/bolt';

import { SLACK_MODULE_OPTIONS } from './constants';
import { SlackModuleOptions } from './slack.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class SlackDriver<Application = any, Options extends SlackModuleOptions = SlackModuleOptions> {
  @Inject()
  protected readonly httpAdapterHost!: HttpAdapterHost;

  @Inject(SLACK_MODULE_OPTIONS)
  protected readonly options!: Options;

  protected client?: App;

  protected abstract createReceiver(): Receiver;

  protected getApplicationInstance(): Application {
    return this.httpAdapterHost.httpAdapter.getInstance();
  }

  public async start(): Promise<void> {
    this.client = new App({
      receiver: this.createReceiver(),
      ...this.options,
    });

    await this.client.start();
  }

  public async stop(): Promise<void> {
    await this.client?.stop();
  }
}

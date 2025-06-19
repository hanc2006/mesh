import { Logger } from '../modules/logger';
import { ServerSettings } from '../settings';
import { DIContainer } from './di';

export interface AppServices {
  logger: Logger;
}

export const initializeAppServices = (settings: ServerSettings) => {
  const container = new DIContainer()
    .add('settings', () => settings)
    .add('logger', () => new Logger(settings.logger!));

  return container;
};

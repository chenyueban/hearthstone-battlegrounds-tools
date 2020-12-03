import { remote } from 'electron';
import Store from 'electron-store';
import { is } from 'electron-util';
import NEDBStore from 'nedb-promises';
import path from 'path';

import type { RecordItem } from '@core/hooks/useStatistics';
import type { RequestMethodReturnMap } from '@core/pages/settings/OBS/types';

import GlobalStore from './store';

interface Config {
  heartstoneRootPath?: string;
  obs: {
    text: {
      enable?: boolean;
      source?: RequestMethodReturnMap['GetSourcesList']['sources'][0];
      max: number;
    };
    image: {
      enable?: boolean;
      dir?: string;
      max: number;
    };
  };
}

// 存储配置文件
export const config = {
  store: new Store<Config>({
    name: 'config',
    defaults: {
      heartstoneRootPath: is.windows
        ? 'C:\\Program Files (x86)\\Hearthstone'
        : is.macos
        ? '/Applications/Hearthstone'
        : '',
      obs: {
        image: {
          max: 12,
        },
        text: {
          max: 12,
        },
      },
    },
  }),
  get(key: keyof Config | string) {
    return this.store.get(key);
  },
  set(key: string, payload: any) {
    return this.store.set(key, payload);
  },
};

const dbPath = path.join(
  remote.app.getPath('userData'),
  remote.app.getName(),
  'ne.db'
);
const db = NEDBStore.create({ filename: dbPath, autoload: true });
export const records: any = {
  store: db,
  find(query: any): Promise<RecordItem[]> {
    // @ts-ignore
    return this.store.find<RecordItem>(query);
  },
  insert(payload: RecordItem) {
    return this.store.insert(payload);
  },
  remove(payload: RecordItem) {
    return this.store.remove({ _id: payload._id }, {});
  },
  update(payload: RecordItem) {
    return this.store.update({ _id: payload._id }, payload);
  },
};

export function getStore(): GlobalStore<any> {
  if (is.main) {
    return global.store;
  }
  if (is.renderer) {
    return remote.getGlobal('store');
  }
  return new GlobalStore();
}

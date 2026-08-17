import { registerPlugin } from '@capacitor/core';
// TODO: TRANSLATE
interface AppSettingsPlugin {
    open(): Promise<void>;
}

export const AppSettings = registerPlugin<AppSettingsPlugin>('AppSettings');

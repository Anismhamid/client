package com.safqa.app;

import android.content.Intent;
import android.provider.Settings;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NotificationSettings")
public class NotificationSettingsPlugin extends Plugin {

    @PluginMethod
    public void open() {

        Intent intent = new Intent(
                Settings.ACTION_APP_NOTIFICATION_SETTINGS
        );

        intent.putExtra(
                Settings.EXTRA_APP_PACKAGE,
                getContext().getPackageName()
        );

        getContext().startActivity(intent);
    }
}
package com.safqa.c2c;

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginMethod;

@CapacitorPlugin(name = "AppSettings")
public class SettingsPlugin extends Plugin {

    @PluginMethod
    public void open(PluginCall call) {
        try {
            Intent intent = new Intent(
                Settings.ACTION_APPLICATION_DETAILS_SETTINGS
            );

            Uri uri = Uri.parse(
                "package:" + getContext().getPackageName()
            );

            intent.setData(uri);

            getContext().startActivity(intent);

            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to open app settings", e);
        }
    }
}
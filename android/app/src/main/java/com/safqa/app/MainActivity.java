package com.safqa.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.safqa.app.SettingsPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(AutofillHelperPlugin.class);
        registerPlugin(CredentialHelperPlugin.class);
        registerPlugin(SettingsPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
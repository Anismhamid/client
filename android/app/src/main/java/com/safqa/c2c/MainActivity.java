package com.safqa.c2c;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.safqa.c2c.SettingsPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(AutofillHelperPlugin.class);
        registerPlugin(CredentialHelperPlugin.class);
        registerPlugin(SettingsPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
package com.safqa.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {

        registerPlugin(AutofillHelperPlugin.class);
        registerPlugin(CredentialHelperPlugin.class);
        registerPlugin(NotificationSettingsPlugin.class);

        super.onCreate(savedInstanceState);
    }
}
package com.safqa.c2c;

import android.os.CancellationSignal;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.GetPasswordOption;
import androidx.credentials.PasswordCredential;
import androidx.credentials.exceptions.GetCredentialException;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "CredentialHelper")
public class CredentialHelperPlugin extends Plugin {

    @PluginMethod
    public void getSavedPassword(PluginCall call) {
        CredentialManager credentialManager = CredentialManager.create(getContext());

        GetPasswordOption passwordOption = new GetPasswordOption();
        GetCredentialRequest request = new GetCredentialRequest.Builder()
                .addCredentialOption(passwordOption)
                .build();

        Executor executor = Executors.newSingleThreadExecutor();

        credentialManager.getCredentialAsync(
                getActivity(),
                request,
                new CancellationSignal(),
                executor,
                new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                    @Override
                    public void onResult(GetCredentialResponse result) {
                        if (result.getCredential() instanceof PasswordCredential) {
                            PasswordCredential cred = (PasswordCredential) result.getCredential();
                            JSObject data = new JSObject();
                            data.put("username", cred.getId());
                            data.put("password", cred.getPassword());
                            call.resolve(data);
                        } else {
                            call.reject("No password credential found");
                        }
                    }

                    @Override
                    public void onError(GetCredentialException e) {
                        call.reject(e.getMessage());
                    }
                }
        );
    }
}
package com.safqa.app;

import android.view.autofill.AutofillManager;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AutofillHelper")
public class AutofillHelperPlugin extends Plugin {
    @PluginMethod
    public void commit(PluginCall call) {
        AutofillManager afm = getActivity().getSystemService(AutofillManager.class);
        if (afm != null) {
            afm.commit();
        }
        call.resolve();
    }
}
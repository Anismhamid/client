# ============================================
# Capacitor
# ============================================
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class * extends com.getcapacitor.Plugin { *; }
-keep class com.getcapacitor.plugin.** { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
}
-keep class * implements com.getcapacitor.PluginHandle { *; }

# WebView JavaScript Interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ============================================
# Cordova
# ============================================
-keep class org.apache.cordova.** { *; }
-keep public class * extends org.apache.cordova.CordovaPlugin

# ============================================
# Firebase
# ============================================
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ============================================
# AndroidX Credentials (Google Sign-In)
# ============================================
-keep class androidx.credentials.** { *; }
-keep class com.google.android.libraries.identity.googleid.** { *; }
-dontwarn androidx.credentials.**

# ============================================
# JS Objects sent from WebView
# ============================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface
-keepattributes *Annotation*

# ============================================
# General
# ============================================
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Preserve generic types
-keep class * extends java.util.List { *; }
-keep class * extends java.util.Map { *; }

# Kotlin (if used)
-dontwarn kotlin.**
-keep class kotlin.** { *; }
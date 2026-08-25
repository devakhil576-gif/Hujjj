package com.motionweave.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String APP_ORIGIN = "https://motionweave.local/";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loadLocalAsset(request.getUrl().toString());
            }
        });

        webView.loadUrl(APP_ORIGIN + "index.html");
        setContentView(webView);
    }

    private WebResourceResponse loadLocalAsset(String url) {
        if (!url.startsWith(APP_ORIGIN)) return null;

        String path = url.substring(APP_ORIGIN.length());
        if (path.isEmpty()) path = "index.html";
        if (path.contains("..") || path.contains("\\")) return null;

        String mime;
        if (path.endsWith(".html")) mime = "text/html";
        else if (path.endsWith(".css")) mime = "text/css";
        else if (path.endsWith(".js")) mime = "application/javascript";
        else if (path.endsWith(".json")) mime = "application/json";
        else if (path.endsWith(".png")) mime = "image/png";
        else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) mime = "image/jpeg";
        else if (path.endsWith(".svg")) mime = "image/svg+xml";
        else return null;

        try {
            InputStream stream = getAssets().open(path);
            return new WebResourceResponse(mime, "UTF-8", stream);
        } catch (IOException ignored) {
            return null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}

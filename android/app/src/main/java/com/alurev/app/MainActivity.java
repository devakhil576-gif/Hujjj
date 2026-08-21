package com.healthbot.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private WebView webView;
    private SharedPreferences prefs;
    private static final String PREFS = "healthbot";

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        webView.setWebViewClient(new WebViewClient());
        webView.addJavascriptInterface(new HealthBridge(), "HealthBridge");
        webView.loadUrl("file:///android_asset/index.html");
        setContentView(webView);
    }

    public class HealthBridge {
        @JavascriptInterface
        public String getApiKeyStatus() {
            return prefs.getString("gemini_key", "").isEmpty() ? "missing" : "ready";
        }

        @JavascriptInterface
        public void saveApiKey(String key) {
            prefs.edit().putString("gemini_key", key == null ? "" : key.trim()).apply();
        }

        @JavascriptInterface
        public void clearApiKey() {
            prefs.edit().remove("gemini_key").apply();
        }

        @JavascriptInterface
        public void ask(String conversationJson) {
            final String key = prefs.getString("gemini_key", "");
            if (key.isEmpty()) {
                postResult(false, "Add a Gemini API key in Settings before starting a consultation.");
                return;
            }
            new Thread(() -> {
                try {
                    JSONArray messages = new JSONArray(conversationJson);
                    JSONObject body = new JSONObject();
                    JSONArray contents = new JSONArray();

                    for (int i = 0; i < messages.length(); i++) {
                        JSONObject m = messages.getJSONObject(i);
                        String role = m.optString("role", "user");
                        String text = m.optString("text", "");
                        JSONObject content = new JSONObject();
                        content.put("role", role.equals("assistant") ? "model" : "user");
                        JSONArray parts = new JSONArray();
                        parts.put(new JSONObject().put("text", text));
                        content.put("parts", parts);
                        contents.put(content);
                    }

                    body.put("contents", contents);
                    body.put("tools", new JSONArray().put(new JSONObject().put("google_search", new JSONObject())));

                    JSONObject system = new JSONObject();
                    system.put("parts", new JSONArray().put(new JSONObject().put("text",
                        "You are HealthBot, a cautious health-information assistant. Provide educational, evidence-aware information, not a diagnosis or replacement for a clinician. Ask concise clarifying questions when needed. For urgent or emergency symptoms, advise the user to seek immediate local emergency medical care or a trusted adult. Never recommend unsafe self-treatment. Be especially careful with children and teenagers: do not provide medication dosing unless the user has supplied a clinician's explicit instructions, and encourage a parent/guardian or clinician when appropriate. Use Google Search grounding for current medical information and prefer authoritative sources. Clearly separate possible explanations from confirmed facts."
                    )));
                    body.put("systemInstruction", system);

                    URL url = new URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setRequestProperty("x-goog-api-key", key);
                    conn.setConnectTimeout(20000);
                    conn.setReadTimeout(60000);
                    conn.setDoOutput(true);
                    byte[] data = body.toString().getBytes(StandardCharsets.UTF_8);
                    try (OutputStream os = conn.getOutputStream()) { os.write(data); }

                    int code = conn.getResponseCode();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(
                        code >= 200 && code < 300 ? conn.getInputStream() : conn.getErrorStream(),
                        StandardCharsets.UTF_8));
                    StringBuilder out = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) out.append(line);
                    reader.close();

                    JSONObject response = new JSONObject(out.toString());
                    if (code < 200 || code >= 300) {
                        String message = response.optJSONObject("error") != null
                            ? response.getJSONObject("error").optString("message", "Gemini API request failed.")
                            : "Gemini API request failed (HTTP " + code + ").";
                        postResult(false, message);
                        return;
                    }

                    String answer = response.getJSONArray("candidates").getJSONObject(0)
                        .getJSONObject("content").getJSONArray("parts").getJSONObject(0).optString("text", "");
                    postResult(true, answer);
                } catch (Exception e) {
                    postResult(false, "Could not reach the AI service. Check your internet connection and API key.");
                }
            }).start();
        }

        private void postResult(boolean ok, String text) {
            new Handler(Looper.getMainLooper()).post(() -> {
                String safe = JSONObject.quote(text);
                webView.evaluateJavascript("window.onHealthBotResult(" + ok + "," + safe + ")", null);
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}

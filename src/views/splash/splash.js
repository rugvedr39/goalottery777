<html><head><meta name="color-scheme" content="light dark"></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">function removeSplashFromWeb() {
  document.getElementById("splash")?.remove();
  document.getElementById("splash-branding")?.remove();
  document.body.style.background = "transparent";
}
</pre></body></html>
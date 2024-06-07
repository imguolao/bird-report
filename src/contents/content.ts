import browser from 'webextension-polyfill';

function injectIframe() {
  const url = browser.runtime.getURL('src/contents/index.html');
  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'display: none;');
  iframe.setAttribute('src', url);

  document.body.appendChild(iframe);
}

injectIframe();

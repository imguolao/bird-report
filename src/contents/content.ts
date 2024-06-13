import browser from 'webextension-polyfill';
import { IFRAME_ID } from './const';
import { log } from '../utils';

function injectRequestScript() {
  const url = browser.runtime.getURL('src/contents/request/index.js');
  const script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('id', 'test');
  document.body.appendChild(script);
} 

function injectIframe() {
  const url = browser.runtime.getURL('src/contents/index.html');
  const iframe = document.createElement('iframe');
  iframe.setAttribute('id', IFRAME_ID);
  iframe.setAttribute('style', 'display: none;');
  iframe.setAttribute('src', url);

  document.body.appendChild(iframe);
}

function injectButton() {
  const url = browser.runtime.getURL('icon/bird_32.png');
  const button = document.createElement('div');
  button.setAttribute('style', `
    height: 32px;
    width: 32px;
    border-radius: 50%;
    position: fixed;
    top: 50vh;
    right: -16px;
    cursor: pointer;
    z-index: 99;
    background: url(${url});
  `);
  button.setAttribute('onmouseover', `this.style.right='0';`);
  button.setAttribute('onmouseleave', `this.style.right='-16px';`);
  button.addEventListener('click', () => {
    window.postMessage({
      type: IFRAME_ID,
      open: true,
    }, '*');
  });

  document.body.appendChild(button);
}

function displayIFrame(show: boolean) {
  const iframe = document.getElementById(IFRAME_ID);
  if (!iframe) {
    log(`Can't found the iframe(${IFRAME_ID}).`);
    return;
  }

  iframe.setAttribute('style', `
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 999;
    top: ${document.documentElement.scrollTop}px;
    left: 0;
    background: #fff;
    display: ${show ? 'block' : 'none'};
  `);

  document.body.style.overflow = show ? 'hidden' : 'auto';

  const fixbar = document.querySelector<HTMLUListElement>('.layui-fixbar');
  if (fixbar) {
    fixbar.style.display = show ? 'none' : 'block';
  }
}

function onMessage() {
  window.addEventListener('message', ({ data }) => {
    if (data?.type !== IFRAME_ID || !Object.hasOwn(data, 'open')) {
      return;
    }

    displayIFrame(!!data.open);
  });
}

injectIframe();
injectRequestScript();
injectButton();
onMessage();

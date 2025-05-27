import React, { useContext, useEffect, useState } from 'react';
import './WasmComponent.css';
import { captureException } from '@sentry/browser';
import Helmet from 'react-helmet';
import WarpError from './WarpError';
import LoadingScreen from './loading-screen/LoadingScreen';
import FullPageModal from './FullPageModal';
import { checkWoWStatus } from './warp-client/requirements';
import UnsupportedModal from './warp-client/UnsupportedModal';
import AuthHeaderContext from './auth/AuthHeaderContext';
import { OpenOnNativeEvent, warpEventBus, WarpEventKind } from './warp-client';

declare global {
  interface Window {
    // These variables are set by the HTML template server-side, with the WASM bundle to load.
    warp_app_base_url: string;
  }
}

function WasmComponent() {
  // WoW fills the page, so hide the authentication header if we're loading it.
  const setDisplayAuthViewHeader = useContext(AuthHeaderContext);

  // Exceptions that originate *before* the wasm file begins executing are caught and stored here.
  const [error, setError] = useState(null);

  // If the wasm file itself crashes, we turn this value to true.
  const [wasmCrash, setWasmCrash] = useState<boolean>(false);

  useEffect(() => {
    setDisplayAuthViewHeader(false);

    // A crash in the wasm file emits a Error event on the window. To determine when the app
    // has crashed, we check to see if the source of the error is the wasm file, as opposed to
    // a JS layer.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event.
    window.addEventListener('error', (event) => {
      if (event.filename.endsWith('.wasm')) {
        setWasmCrash(true);
      }
    });

    const removeOpenNativeListener = warpEventBus.addListener((event) => {
      if (event.kind === WarpEventKind.OpenOnNative) {
        window.open((event as OpenOnNativeEvent).url, '_self');
      }
    });

    // In development, React mounts components twice to catch bugs. To ensure we only mount the
    // WASM application once, use an `ignore` flag.
    // See https://react.dev/learn/synchronizing-with-effects#fetching-data
    let ignore = false;

    // Tell Webpack _not_ to treat this as a dynamic module import.
    // See https://webpack.js.org/api/module-methods/#webpackignore
    import(/* webpackIgnore: true */ `${window.warp_app_base_url}warp.js`)
      .then(async (mod) => {
        if (!ignore) {
          await mod.default();
        }
      })
      .catch((err) => {
        // On the web, winit throws an exception to break out of WASM execution:
        // https://github.com/rust-windowing/winit/blob/4b3c0655bfbdd4c6eee435f1353b72abc3e8060e/src/platform_impl/web/event_loop/mod.rs#L61-L63
        if (!err.message.startsWith('Using exceptions for control flow')) {
          captureException(err);
          setError(err);
        }
      });

    return () => {
      ignore = true;
      removeOpenNativeListener();
    };
  }, [setDisplayAuthViewHeader]);

  // WasmView is responsible for checking WoW support. To reduce the likelihood of showing a blank screen,
  // double-check here.
  const status = checkWoWStatus();
  if (!status.supported) {
    // eslint-disable-next-line no-console
    console.error("Tried to render WoW, but it's not supported");
    return (
      <UnsupportedModal
        status={status}
        redirectMessage="Warp on Web is not supported"
      />
    );
  }

  if (wasmCrash) {
    return <FullPageModal error="Warp crashed. Reload the page?" />;
  }

  return (
    <>
      <Helmet>
        <link
          rel="preload"
          href={`${window.warp_app_base_url}warp_bg.wasm`}
          as="fetch"
          type="application/wasm"
          crossOrigin="anonymous"
        />
      </Helmet>
      <div id="wasm-container">
        {error ? <WarpError error="Unable to load Warp" /> : <LoadingScreen />}
      </div>
    </>
  );
}

export default React.memo(WasmComponent);

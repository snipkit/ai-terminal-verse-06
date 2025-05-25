
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { wasmIntegration } from '@sentry/wasm';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { makeFetchTransport } from '@sentry/browser';
import { makeMultiplexedTransport } from '@sentry/core';
import { Envelope, EnvelopeItemType, ErrorEvent, Event } from '@sentry/types';

import { ErrorLoggedEvent, WarpEventKind, warpEventBus } from './components/warp-client';
import App from './App';
import { isProd, isStaging } from './utils/env';
import './index.css';

declare global {
  interface Window {
    rudderanalytics: any;
    // This variable is set by the HTML template server-side.
    warp_app_version: string;
  }
}

if (process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID);
  ReactGA.send('pageview');
}

// Sentry MatchParam
// Copied from https://docs.sentry.io/platforms/javascript/best-practices/micro-frontends/
interface MatchParam {
  /** The envelope to be sent */
  envelope: Envelope;
  /**
   * A function that returns an event from the envelope if one exists. You can optionally pass an array of envelope item
   * types to filter by - only envelopes matching the given types will be returned.
   *
   * @param types Defaults to ['event'] (only error events will be returned)
   */
  getEvent(types?: EnvelopeItemType[]): Event | undefined;
}

// Determines if this Sentry event originates in the wasm app.
function isWasmEvent(event: Event): boolean {
  // Check if the event has been explicitly tagged as originating in the wasm app.
  // This is used for error logs from the app that we route through react.
  if (event?.tags?.feature === 'wasm') {
    return true;
  }

  // Check the stack frames of the exception for mention of a wasm file.
  // This is used for exceptions that are caught by the wasm integration.
  const values = event?.exception?.values || [];
  return values.some((v) => {
    const frames = v.stacktrace?.frames || [];
    // With the inclusion of debug info, there may additional context about the location of the
    // function after the filename itself
    // (e.g.: http://localhost:8080/assets/client/wasm/warp_bg.wasm:wasm-function[49050]:0x1d2454)
    // so we check if '.wasm' appears _anywhere_ in the filename.
    return frames.some((frame) => frame.filename?.includes('.wasm'));
  });
}

function dsnFromFeature({ getEvent }: MatchParam) {
  const event = getEvent()!;

  if (isWasmEvent(event)) {
    return [
      {
        dsn: process.env.REACT_APP_WASM_SENTRY_DSN!,
        release: `warp_wasm@${window.warp_app_version}`,
      },
    ];
  }

  return [];
}

// Removes the session sharing password from the request URL, if it exists.
function sanitizeRequest({ request }: ErrorEvent) {
  if (!request) {
    return;
  }

  if (request.url) {
    const url = new URL(request.url);
    url.searchParams.delete('pwd');
    request.url = url.toString();
  }
}

// Removes the session sharing password from relevant breadcrumbs, if it exists.
function sanitizeBreadcrumbs({ breadcrumbs }: ErrorEvent) {
  if (!breadcrumbs) {
    return;
  }

  breadcrumbs.forEach((breadcrumb) => {
    const { data } = breadcrumb;
    if (!data) {
      return;
    }

    if (data.url) {
      const url = new URL(data.url);
      url.searchParams.delete('pwd');
      data.url = url.toString();
    }
  });
}

function getWasmSentryEnvironment() {
  let channel = 'local';
  if (isProd()) {
    channel = 'stable_release';
  } else if (isStaging()) {
    channel = 'dev_release';
  }

  return `wasm_${channel}`;
}

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [wasmIntegration()],
  transport: makeMultiplexedTransport(makeFetchTransport, dsnFromFeature),
  tunnel: '/proxy/sentry',
  beforeSend(event) {
    sanitizeRequest(event);
    sanitizeBreadcrumbs(event);

    if (isWasmEvent(event)) {
      return {
        ...event,
        environment: getWasmSentryEnvironment(),
      };
    }

    return event;
  },
});

// Send error logs from the Warp app to Sentry.
warpEventBus.addListener((event) => {
  if (event.kind === WarpEventKind.ErrorLogged) {
    Sentry.captureMessage((event as ErrorLoggedEvent).error, (scope) => {
      scope.setTag('feature', 'wasm');
      return scope;
    });
  }
});

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <Router>
      <App />
    </Router>
  </Sentry.ErrorBoundary>,
  document.getElementById('root')
);

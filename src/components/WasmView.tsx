import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { captureException } from '@sentry/core';
import WasmComponent from './WasmComponent';
import FullPageModal from './FullPageModal';
import LoadingScreen from './loading-screen/LoadingScreen';
import { checkWoWStatus } from './warp-client/requirements';
import UnsupportedModal from './warp-client/UnsupportedModal';
import { checkAppInstallation } from './utils/app_detection';

// NOTE: This string much rename in sync with the one that defines the setting in warp-internal
// https://github.com/warpdotdev/warp-internal/blob/86f45a40e9b0dd29fe98f40a2c02d33805d8be22/app/src/settings/native_preference.rs#L20-L21
const USER_NATIVE_PREFERENCE_KEY = 'UserNativePreference';

enum UserNativePreference {
  NotSelected = 'NotSelected',
  Web = 'Web',
  Desktop = 'Desktop',
}

interface WasmViewProps {
  splashPageMessage: string;
  appLaunchUrl: string;
  redirectUrl?: string;
}

const WasmView = ({
  splashPageMessage,
  appLaunchUrl,
  redirectUrl,
}: WasmViewProps) => {
  // Track whether or not the user explicitly requested Warp on Web. We use this so that, if the user clicks "View on web"
  // from the desktop redirect modal, they're not sent back to the desktop.
  const [webRequested, setWebRequested] = useState(false);
  const [userNativePreference, setUserNativePreference] = useState(
    UserNativePreference.NotSelected
  );

  const [nativePreferenceIsLoading, setNativePreferenceIsLoading] = useState(
    true
  );
  const [appDetected, setAppDetected] = useState<boolean>(true);
  const [
    appInstallationDetectLoading,
    setAppInstallationDetectLoading,
  ] = useState(true);

  useEffect(() => {
    // Try to read the user app installation status from local storage
    checkAppInstallation()
      .then((detected) => {
        setAppDetected(detected);
        setAppInstallationDetectLoading(false);
      })
      .catch((err) => {
        captureException(err);
        setAppDetected(false);
        setAppInstallationDetectLoading(false);
      });
  }, []);

  useEffect(() => {
    const userNativePreferenceSetting = window.localStorage.getItem(
      USER_NATIVE_PREFERENCE_KEY
    );

    if (userNativePreferenceSetting !== null) {
      // Same logic as above for the double parse.
      const preferenceString: String = JSON.parse(
        JSON.parse(userNativePreferenceSetting)
      );
      const userNativePreferenceFromStorage =
        UserNativePreference[
          preferenceString as keyof typeof UserNativePreference
        ];

      if (userNativePreferenceFromStorage !== undefined) {
        setUserNativePreference(userNativePreferenceFromStorage);
      }
    }
    setNativePreferenceIsLoading(false);
  }, [setUserNativePreference]);

  if (nativePreferenceIsLoading || appInstallationDetectLoading) {
    return <LoadingScreen />;
  }

  if (isMobile) {
    return (
      <FullPageModal error="Please visit this link on a desktop or laptop computer with Warp installed." />
    );
  }

  // If Warp on Web will not be able to load, redirect to desktop.
  const wowStatus = checkWoWStatus();
  if (!wowStatus.supported) {
    return (
      <UnsupportedModal
        status={wowStatus}
        redirectMessage={splashPageMessage}
        appLaunchUrl={appLaunchUrl}
      />
    );
  }

  // Choose whether to show the desktop redirect or WASM.
  // If the user requested WoW for this session, open WASM.
  // If the user has no preference:
  //   and Warp is installed: redirect to desktop
  //   and Warp is not installed: open WASM and show preference NUX
  // If the user has a preference, respect it. Since the installation detection logic isn't 100% accurate, we always
  // follow the user's choice if available.

  let shouldDirectToDesktop;
  if (webRequested) {
    shouldDirectToDesktop = false;
  } else {
    switch (userNativePreference) {
      case UserNativePreference.NotSelected:
        shouldDirectToDesktop = appDetected;
        break;
      case UserNativePreference.Web:
        shouldDirectToDesktop = false;
        break;
      case UserNativePreference.Desktop:
        shouldDirectToDesktop = true;
        break;
      default:
        // This case should be unreachable. Default to desktop, with an option to stay on web.
        shouldDirectToDesktop = true;
    }
  }

  // If we want to direct to desktop
  if (shouldDirectToDesktop) {
    const viewOnWebCallback = () => {
      setWebRequested(true);
    };

    return (
      <FullPageModal
        appDetected={appDetected}
        appLaunchUrl={appLaunchUrl}
        message={splashPageMessage}
        viewOnWebCallback={viewOnWebCallback}
      />
    );
  }

  if (redirectUrl) {
    window.history.replaceState({ pathname: redirectUrl }, '', redirectUrl);
  }
  // Otherwise just return the wasm component
  return (
    <>
      <WasmComponent />
    </>
  );
};

WasmView.defaultProps = {
  redirectUrl: undefined,
};

export default WasmView;

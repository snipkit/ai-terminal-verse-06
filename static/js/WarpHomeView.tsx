import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Navigate } from 'react-router-dom';
import { User } from './AuthenticatedView';
import FullPageModal from './FullPageModal';
import { checkWoWStatus } from './warp-client/requirements';
import UnsupportedModal from './warp-client/UnsupportedModal';
import WasmComponent from './WasmComponent';

interface WarpHomeViewProps {
  user: User;
}

// The root view unconditionally loads Warp on Web, bypassing the native/web and app installation detection logic in
// WasmView.
function WarpHomeView({ user }: WarpHomeViewProps) {
  const telemetryEnabled = user ? user.isTelemetryEnabled : true;
  useEffect(() => {
    if (telemetryEnabled) {
      window.rudderanalytics.track('Visited app home view');
    }
  }, [telemetryEnabled]);

  // If there's no user, redirect to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
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
        redirectMessage="Open Warp"
        appLaunchUrl={`${process.env.REACT_APP_DEFAULT_SCHEME}://home`}
      />
    );
  }

  return <WasmComponent />;
}

export default WarpHomeView;

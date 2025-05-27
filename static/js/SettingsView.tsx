import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';

import { User } from './AuthenticatedView';
import createRedirectAfterLoginPath from './utils/redirectAfterLogin';
import FullPageModal from './FullPageModal';
import WasmView from './WasmView';

interface SettingsViewProps {
  user: User;
}

function getAppLaunchURL(subsection: string, search: string): string {
  return `${process.env.REACT_APP_DEFAULT_SCHEME}://settings/${subsection}${search}`;
}

const SettingsView = ({ user }: SettingsViewProps) => {
  if (user?.isTelemetryEnabled) {
    window.rudderanalytics.track('Visited settings view');
  }
  const { pathname, search } = useLocation();
  const params = useParams<{ sub_section: string }>();

  const subsection = params.sub_section;

  if (!user) {
    return (
      <Navigate
        to={createRedirectAfterLoginPath(`${pathname}${search}`)}
        replace
      />
    );
  }

  // For now, we only support linking to the settings teams view
  if (subsection === null || subsection !== 'teams') {
    return <FullPageModal error="Not found." />;
  }

  return (
    <WasmView
      splashPageMessage="Redirecting to team settings"
      appLaunchUrl={getAppLaunchURL(subsection, search)}
    />
  );
};

export default SettingsView;

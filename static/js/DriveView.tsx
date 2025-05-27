import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { User } from './AuthenticatedView';
import LoadingScreen from './loading-screen/LoadingScreen';
import WasmView from './WasmView';
import FullPageModal from './FullPageModal';
import RequestAccessModal from './RequestAccessModal';
import { checkAppInstallation } from './utils/app_detection';
import CheckAndRecordObjectAccess, {
  AllowedObjectTypes,
} from './graphql/mutations/CheckAndRecordObjectAccess';
import { ON_LOGIN_REDIRECT_QUERY_KEY } from './utils/redirectAfterLogin';

interface DriveViewProps {
  user: User;
  logout: () => Promise<void>;
}

function getAppLaunchURL(
  objectType: AllowedObjectTypes,
  objectUID: string,
  focusedFolderUID: string | null,
  inviteeEmail: string | null
): string {
  return `${
    process.env.REACT_APP_DEFAULT_SCHEME
  }://drive/${objectType}?id=${objectUID}${
    focusedFolderUID ? `&focused_folder_id=${focusedFolderUID}` : ''
  }${inviteeEmail ? `&invitee_email=${inviteeEmail}` : ''}`;
}

function getEmptyFolderAppLaunchURL(
  objectUID: string,
  inviteeEmail: string | null
): string {
  return `${
    process.env.REACT_APP_DEFAULT_SCHEME
  }://drive/folder?id=${objectUID}${
    inviteeEmail ? `&invitee_email=${inviteeEmail}` : ''
  }`;
}

enum DriveViewState {
  Loading,
  Errored,
  ObjectNotFound,
  ObjectAccessDenied,
  ObjectAccessGranted,
  FolderNotOpenable,
}

function mapObjectTypeToEnum(objectType: string): AllowedObjectTypes | null {
  switch (objectType) {
    case AllowedObjectTypes.Notebook:
      return AllowedObjectTypes.Notebook;
    case AllowedObjectTypes.Workflow:
      return AllowedObjectTypes.Workflow;
    case AllowedObjectTypes.Prompt:
      return AllowedObjectTypes.Prompt;
    case AllowedObjectTypes.EnvironmentVariables:
      return AllowedObjectTypes.EnvironmentVariables;
    case AllowedObjectTypes.Folder:
      return AllowedObjectTypes.Folder;
    default:
      return null;
  }
}

function getObjectUID(objectSlug: string): string {
  const parts = objectSlug.split('-');
  return parts[parts.length - 1];
}

const NOT_FOUND_MESSAGE = "The resource you're looking for could not be found.";

const DriveView = ({ user, logout }: DriveViewProps) => {
  const params = useParams<{ object_type: string; object_slug: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const inviteeEmail = searchParams.get('invitee_email');

  const objectType = mapObjectTypeToEnum(params.object_type || '');
  const objectUID = getObjectUID(params.object_slug || '');

  const telemetryEnabled = user ? user.isTelemetryEnabled : true;
  useEffect(() => {
    if (telemetryEnabled) {
      window.rudderanalytics.track('Visited drive link view', {
        object_type: params.object_type,
        object_uid: objectUID,
      });
    }
  }, [telemetryEnabled, params, objectUID]);

  const [primaryObjectID, setPrimaryObjectID] = useState<string | null>(null);
  const [
    primaryObjectType,
    setPrimaryObjectType,
  ] = useState<AllowedObjectTypes | null>(null);

  const [driveViewState, setDriveViewState] = useState(DriveViewState.Loading);
  const [objectName, setObjectName] = useState<string>('Unknown');
  const [appDetectionLoading, setAppDetectionLoading] = useState<boolean>(true);
  const [appDetected, setAppDetected] = useState<boolean>(true);

  const { query, variables, parseData } = CheckAndRecordObjectAccess({
    uid: objectUID,
  });
  const [checkAndRecordObjectAccessMutation, checkAccessState] = useMutation(
    query,
    {
      variables,
    }
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !checkAccessState.called) {
      // If we have enough information to check access, but haven't done so yet, make the request.
      checkAndRecordObjectAccessMutation();
    } else if (checkAccessState.error) {
      const errorMessage = checkAccessState.error.message;
      if (errorMessage.startsWith('Not found')) {
        setDriveViewState(DriveViewState.ObjectNotFound);
      } else if (errorMessage.startsWith('Unauthorized')) {
        // If the user is anonymous, log them out and redirect to the login page if they don't have access.
        if (user?.isAnonymous) {
          logout().then(() => {
            navigate(
              `/login?${ON_LOGIN_REDIRECT_QUERY_KEY}=${encodeURIComponent(
                window.location.pathname
              )}`
            );
          });
          setDriveViewState(DriveViewState.Loading);
        } else {
          setDriveViewState(DriveViewState.ObjectAccessDenied);
        }
      } else {
        setDriveViewState(DriveViewState.Errored);
      }
    } else if (checkAccessState.data) {
      const parsedData = parseData(checkAccessState.data);
      setObjectName(parsedData.objectName);

      if (parsedData.isTrashed) {
        setDriveViewState(DriveViewState.ObjectNotFound);
      } else if (objectType === AllowedObjectTypes.Folder) {
        if (parsedData.folderPrimaryObject) {
          const {
            objectType: primaryObjectTypeName,
            metadata: { uid: primaryObjectUID },
          } = parsedData.folderPrimaryObject;

          setPrimaryObjectID(primaryObjectUID);
          setPrimaryObjectType(primaryObjectTypeName);
          setDriveViewState(DriveViewState.ObjectAccessGranted);
        } else {
          setDriveViewState(DriveViewState.FolderNotOpenable);
        }
      } else {
        setDriveViewState(DriveViewState.ObjectAccessGranted);
      }
    }
  }, [
    user,
    checkAccessState,
    objectType,
    checkAndRecordObjectAccessMutation,
    logout,
    navigate,
    parseData,
  ]);

  // Check if application is detected
  useEffect(() => {
    checkAppInstallation().then((detected) => {
      setAppDetected(detected);
      setAppDetectionLoading(false);
    });
  }, []);

  if (!user) {
    return <LoadingScreen />;
  }

  if (driveViewState === DriveViewState.Loading || appDetectionLoading) {
    return <LoadingScreen />;
  }

  if (
    !objectType ||
    !objectUID ||
    driveViewState === DriveViewState.ObjectNotFound ||
    driveViewState === DriveViewState.Errored
  ) {
    return <FullPageModal error={NOT_FOUND_MESSAGE} />;
  }

  if (driveViewState === DriveViewState.ObjectAccessDenied) {
    return <RequestAccessModal objectUID={objectUID} />;
  }

  const splashPageMessage = `Open Warp to view ${
    objectType === AllowedObjectTypes.EnvironmentVariables
      ? 'these environment variables'
      : objectName ??
        `this ${objectType[0].toUpperCase() + objectType.slice(1)}`
  }`;

  // For folder objects, we actually want to launch the primary object for that folder,
  // with a query param to specifiy which folder to focus upon opening the object. The
  // exception is when the folder is not openable (i.e. it has not primary object). We don't
  // have a fallback on the web in this case, so we link to the desktop app where the folder will be focused.
  const appLaunchUrl =
    driveViewState === DriveViewState.FolderNotOpenable
      ? getEmptyFolderAppLaunchURL(objectUID, inviteeEmail)
      : getAppLaunchURL(
          primaryObjectType ?? objectType,
          primaryObjectID ?? objectUID,
          objectType === AllowedObjectTypes.Folder ? objectUID : null,
          inviteeEmail
        );

  if (driveViewState === DriveViewState.FolderNotOpenable) {
    return (
      <FullPageModal
        appDetected={appDetected}
        appLaunchUrl={appLaunchUrl}
        message={splashPageMessage}
      />
    );
  }

  if (objectType === AllowedObjectTypes.EnvironmentVariables) {
    return (
      <FullPageModal
        appDetected={appDetected}
        appLaunchUrl={appLaunchUrl}
        message={splashPageMessage}
      />
    );
  }

  // When loading the wasm view, folders will redirect to the primary object
  let redirectUrl;
  if (
    objectType === AllowedObjectTypes.Folder &&
    primaryObjectID &&
    primaryObjectType
  ) {
    redirectUrl = `/drive/${primaryObjectType}/${primaryObjectID}?focused_folder_id=${objectUID}${
      inviteeEmail ? `&invitee_email=${inviteeEmail}` : ''
    }`;
  }

  return (
    <WasmView
      splashPageMessage={splashPageMessage}
      appLaunchUrl={appLaunchUrl}
      redirectUrl={redirectUrl}
    />
  );
};

export default DriveView;

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client';
import { User } from './AuthenticatedView';
import ModalContainer, {
  ModalContainerIconType,
} from '../../static/js/modal-container/ModalContainer';
import ModalContainerHeader from '../../static/js/modal-container/ModalContainerHeader';
import ModalContainerBody from '../../static/js/modal-container/ModalContainerBody';
import './user-data.css';
import ModalContainerButton, {
  ModalContainerButtonAccent,
  ModalContainerButtonTreatment,
  ModalContainerButtonType,
} from '../../static/js/modal-container/ModalContainerButton';
import GetUserForUserDataView, {
  UserForUserDataView,
} from './graphql/queries/GetUserForUserDataView';
import TransferTeamOwnershipMutation from './graphql/mutations/TransferTeamOwnership';
import DeleteUser from './graphql/mutations/DeleteUser';
import ModalContainerButtonSpacer from '../../static/js/modal-container/ModalContainerButtonSpacer';

export interface UserDataProps {
  user: User;
  anonymousUserProvidedLoginToken: boolean;
}

enum FormStep {
  Initial,
  TransferTeamOwnership,
  ConfirmDelete,
  DeletionComplete,
  Errored,
}

const UserDataView = ({
  user,
  anonymousUserProvidedLoginToken,
}: UserDataProps) => {
  const [currentStep, setCurrentStep] = useState(FormStep.Initial);
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [
    userForUserDataView,
    setUserForUserDataView,
  ] = useState<UserForUserDataView | null>(null);

  const {
    query: getUserQuery,
    variables: getUserVariables,
    parseData: parseUserData,
  } = GetUserForUserDataView();
  // We use a lazy query and explicitly disable caching to avoid the scenario where you try to
  // delete your data -> you transfer ownership -> you cancel -> you hit the delete button again.
  // If we didn't hard refetch, we would think you're still the admin, since the query hasn't changed.
  const [loadUser] = useLazyQuery(getUserQuery, {
    variables: getUserVariables,
    fetchPolicy: 'network-only',
    onCompleted(data) {
      const userData = parseUserData(data);
      setUserForUserDataView(userData);

      const needsTeamTransfer =
        userData?.teamName &&
        userData.members.length > 1 &&
        userData.adminUid === user.firebaseUID;

      if (needsTeamTransfer) {
        setCurrentStep(FormStep.TransferTeamOwnership);
      } else {
        setCurrentStep(FormStep.ConfirmDelete);
      }
    },
  });

  const {
    query: transferTeamOwnershipQuery,
    variables: transferTeamOwnershipVariables,
    parseData: parseTransferTeamOwnershipData,
  } = TransferTeamOwnershipMutation({ newOwnerEmail });
  const [transferTeamOwnershipMutation] = useMutation(
    transferTeamOwnershipQuery,
    {
      variables: transferTeamOwnershipVariables,
      onCompleted(data) {
        const success = parseTransferTeamOwnershipData(data);
        if (success) {
          setCurrentStep(FormStep.ConfirmDelete);
        } else {
          setCurrentStep(FormStep.Errored);
        }
      },
      onError() {
        setCurrentStep(FormStep.Errored);
      },
    }
  );

  const {
    query: deleteUserQuery,
    variables: deleteUserVariables,
  } = DeleteUser();
  const [deleteUserMutation] = useMutation(deleteUserQuery, {
    variables: deleteUserVariables,
    onCompleted(data) {
      if (data?.deleteUser?.success) {
        setCurrentStep(FormStep.DeletionComplete);
      } else {
        setCurrentStep(FormStep.Errored);
      }
    },
    onError() {
      setCurrentStep(FormStep.Errored);
    },
  });

  if (!user && !anonymousUserProvidedLoginToken) {
    return <Navigate to="/login" replace />;
  }

  const cancelDataDeletion = () => {
    setConfirmedEmail('');
    setCurrentStep(FormStep.Initial);
  };
  const transferTeam = () => {
    transferTeamOwnershipMutation();
  };

  const getContent = () => {
    if (currentStep === FormStep.Initial) {
      return {
        icon: ModalContainerIconType.Logo,
        headerText: 'What would you like to do with your data?',
        bodyContent: (
          <>
            {/* TODO: add this in when we support export
            <div>
              Click to download all of your data on Warp&apos;s servers.
            </div>
            <ModalContainerButton
              text={"Download"}
              type={ModalContainerButtonType.Button}
              treatment={ModalContainerButtonTreatment.Primary}
            />
            <div className="user-data-form-spacer" /> */}
            <div>Click to delete all of your data on Warp&apos;s servers.</div>
            <ModalContainerButton
              content={<>Delete</>}
              buttonType={ModalContainerButtonType.Button}
              treatment={ModalContainerButtonTreatment.FullWidth}
              accent={ModalContainerButtonAccent.Destructive}
              onClickFunction={() => loadUser()}
            />
          </>
        ),
      };
    }
    if (currentStep === FormStep.ConfirmDelete) {
      const hasEmail = !!userForUserDataView?.email;
      const emailMatches =
        !hasEmail || confirmedEmail === userForUserDataView?.email;

      return {
        icon: ModalContainerIconType.Alert,
        headerText: 'Are you sure you want to delete ALL your data?',
        bodyContent: (
          <>
            <ModalContainerButtonSpacer>
              <div>
                <p>
                  This includes your account, any paid subscriptions, shared
                  blocks, settings, Warp Drive objects, team memberships, and
                  any other data stored on Warp servers.
                </p>
                <p>
                  This process is irreversible. You will no longer be able to
                  use Warp.
                </p>
                {hasEmail && <p>Please enter your email address to confirm.</p>}
              </div>
              {hasEmail && (
                <>
                  <div className="font-weight-400 text-white">Email</div>
                  <input
                    className="modal-container-input"
                    type="text"
                    placeholder={`${userForUserDataView?.email}`}
                    required
                    value={confirmedEmail}
                    onChange={(e) => setConfirmedEmail(e.target.value)}
                  />
                </>
              )}
              <ModalContainerButton
                content={<>Yes, delete all my data</>}
                buttonType={ModalContainerButtonType.Button}
                treatment={ModalContainerButtonTreatment.FullWidth}
                accent={
                  !emailMatches
                    ? ModalContainerButtonAccent.Transparent
                    : ModalContainerButtonAccent.Destructive
                }
                disabled={!emailMatches}
                onClickFunction={() => deleteUserMutation()}
              />
              <ModalContainerButton
                content={<>Cancel</>}
                buttonType={ModalContainerButtonType.Button}
                treatment={ModalContainerButtonTreatment.FullWidth}
                accent={ModalContainerButtonAccent.Transparent}
                onClickFunction={() => cancelDataDeletion()}
              />
            </ModalContainerButtonSpacer>
          </>
        ),
      };
    }
    if (currentStep === FormStep.TransferTeamOwnership) {
      const newOwnerEmailSelected = newOwnerEmail.length > 0;

      return {
        icon: ModalContainerIconType.Warning,
        headerText: `You are the admin of ${userForUserDataView?.teamName}.`,
        bodyContent: (
          <>
            <div>
              Transfer ownership of the team to another team member to continue
              with deletion.
            </div>
            <select
              className="user-data-form-select"
              defaultValue="default"
              onChange={(e) => setNewOwnerEmail(e.currentTarget.value)}
            >
              <option value="default" disabled hidden>
                Select a team member
              </option>
              {userForUserDataView?.members
                .filter(
                  (member: any) => member.email !== userForUserDataView.email
                )
                .map((member: any) => (
                  <option key={member.email} value={member.email}>
                    {member.email}
                  </option>
                ))}
            </select>
            <ModalContainerButton
              disabled={!newOwnerEmailSelected}
              content={<>Confirm</>}
              buttonType={ModalContainerButtonType.Button}
              treatment={ModalContainerButtonTreatment.FullWidth}
              accent={
                newOwnerEmailSelected
                  ? ModalContainerButtonAccent.Primary
                  : ModalContainerButtonAccent.Transparent
              }
              onClickFunction={() => transferTeam()}
            />
          </>
        ),
      };
    }
    if (currentStep === FormStep.DeletionComplete) {
      return {
        icon: ModalContainerIconType.Warning,
        headerText: 'Your data deletion request has been received.',
        bodyContent: (
          <div>
            <p>Please allow 24-48 hours for complete deletion of your data.</p>
            <p>Thank you for your patience.</p>
          </div>
        ),
      };
    }

    return {
      icon: ModalContainerIconType.Warning,
      headerText: 'Oops! Something went wrong.',
      bodyContent: (
        <>
          <div>Please refresh the page and try again.</div>
          <div>
            If the issue persists, email us at privacy@warp.dev to continue with
            your request.
          </div>
        </>
      ),
    };
  };

  const content = getContent();

  return (
    <ModalContainer iconType={content?.icon}>
      <ModalContainerHeader>{content?.headerText}</ModalContainerHeader>
      <ModalContainerBody>{content?.bodyContent}</ModalContainerBody>
    </ModalContainer>
  );
};

export { UserDataView };

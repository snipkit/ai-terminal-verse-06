import React from 'react';
import ModalContainer, {
  ModalContainerIconType,
} from './modal-container/ModalContainer';
import ModalContainerBody from './modal-container/ModalContainerBody';
import ModalContainerButton, {
  ModalContainerButtonAccent,
  ModalContainerButtonTreatment,
} from './modal-container/ModalContainerButton';
import ModalContainerHeader from './modal-container/ModalContainerHeader';
import DesktopRedirect from './utils/DesktopRedirect';
import { WARP_DOWNLOAD_URL } from './utils/app_detection';

interface Message {
  message: string;
  error?: never;
  appLaunchUrl: string;
  viewOnWebCallback?: () => void;
  appDetected: boolean;
}

interface Error {
  message?: never;
  error: string;
  appLaunchUrl?: never;
  viewOnWebCallback?: never;
  appDetected?: boolean;
}

type RenderParams = Message | Error;

function FullPageModal({
  message,
  error,
  appLaunchUrl,
  viewOnWebCallback,
  appDetected = true,
}: RenderParams): JSX.Element {
  return (
    <>
      {appLaunchUrl && <DesktopRedirect url={appLaunchUrl} />}
      <ModalContainer
        iconType={
          error ? ModalContainerIconType.Warning : ModalContainerIconType.Logo
        }
      >
        <ModalContainerHeader>{message ?? error}</ModalContainerHeader>
        <ModalContainerBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!error && (
              <>
                {appDetected ? (
                  <ModalContainerButton
                    content={<>Open Warp</>}
                    treatment={ModalContainerButtonTreatment.FullWidth}
                    accent={ModalContainerButtonAccent.Primary}
                    href={appLaunchUrl}
                  />
                ) : (
                  <ModalContainerButton
                    content={<>Download Warp</>}
                    treatment={ModalContainerButtonTreatment.FullWidth}
                    accent={ModalContainerButtonAccent.Primary}
                    href={WARP_DOWNLOAD_URL}
                  />
                )}
                {viewOnWebCallback !== undefined && (
                  <ModalContainerButton
                    content={<>View on the web</>}
                    treatment={ModalContainerButtonTreatment.FullWidth}
                    accent={ModalContainerButtonAccent.Transparent}
                    onClickFunction={() => {
                      viewOnWebCallback();
                    }}
                  />
                )}
              </>
            )}
          </div>
        </ModalContainerBody>
      </ModalContainer>
    </>
  );
}

export default FullPageModal;

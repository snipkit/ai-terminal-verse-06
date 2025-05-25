
import { gql } from '@apollo/client';

const TRANSFER_TEAM_OWNERSHIP = gql`
  mutation TransferTeamOwnership($newOwnerEmail: String!) {
    transferTeamOwnership(newOwnerEmail: $newOwnerEmail) {
      success
    }
  }
`;

const TransferTeamOwnershipMutation = ({ newOwnerEmail }: { newOwnerEmail: string }) => {
  return {
    query: TRANSFER_TEAM_OWNERSHIP,
    variables: { newOwnerEmail },
    parseData: (data: any): boolean => {
      return data?.transferTeamOwnership?.success || false;
    },
  };
};

export default TransferTeamOwnershipMutation;

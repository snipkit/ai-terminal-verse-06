
import { gql } from '@apollo/client';

export interface UserForUserDataView {
  email: string;
  teamName?: string;
  adminUid?: string;
  members: Array<{
    email: string;
    uid: string;
  }>;
}

const GET_USER_FOR_USER_DATA_VIEW = gql`
  query GetUserForUserDataView {
    user {
      email
      teamName
      adminUid
      members {
        email
        uid
      }
    }
  }
`;

const GetUserForUserDataView = () => {
  return {
    query: GET_USER_FOR_USER_DATA_VIEW,
    variables: {},
    parseData: (data: any): UserForUserDataView | null => {
      return data?.user || null;
    },
  };
};

export default GetUserForUserDataView;

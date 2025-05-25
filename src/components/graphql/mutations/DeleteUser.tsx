
import { gql } from '@apollo/client';

const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      success
    }
  }
`;

const DeleteUser = () => {
  return {
    query: DELETE_USER,
    variables: {},
  };
};

export default DeleteUser;

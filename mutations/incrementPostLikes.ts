import { gql } from '@apollo/client';

export const INCREMENT_POST_LIKES = gql`
  mutation IncrementPostLikes($postId: ID!) {
    incrementPostLikes(input: { postId: $postId }) {
      post {
        id
        title
        likes
      }
      likes
    }
  }
`;
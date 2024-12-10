add_action('graphql_register_types', function() {
  register_graphql_mutation('incrementPostLikes', [
    'inputFields' => [
      'postId' => [
        'type' => 'ID',
        'description' => 'ID of the post to like',
      ],
    ],
    'outputFields' => [
      'post' => [
        'type' => 'Post',
        'resolve' => function($payload, $args, $context, $info) {
          return \WPGraphQL\Data\DataSource::resolve_post_object($payload['post_id'], $context);
        }
      ],
      'likes' => [
        'type' => 'Int',
        'resolve' => function($payload) {
          return $payload['likes'];
        }
      ],
    ],
    'mutateAndGetPayload' => function($input, $context, $info) {
      // Get the post ID and current user ID
      $post_id = absint($input['postId']);
      $current_user_id = get_current_user_id();

      // Get the current likes and the list of users who liked the post
      $likes = get_field('likes', $post_id);
      $liked_users = get_field('liked_users', $post_id);

      // Initialize if necessary
      if ($likes === null) {
        $likes = 0;
      }
      if ($liked_users === null) {
        $liked_users = [];
      }

      // Check if the current user has already liked the post
      if (!in_array($current_user_id, $liked_users)) {
        // Increment the like count and add the user to the liked users list
        $likes++;
        $liked_users[] = $current_user_id;

        // Update the fields
        update_field('likes', $likes, $post_id);
        update_field('liked_users', $liked_users, $post_id);
      }

      return [
        'post_id' => $post_id,
        'likes' => $likes,
      ];
    }
  ]);
});


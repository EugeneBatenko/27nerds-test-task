import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { INCREMENT_POST_LIKES } from "../mutations/incrementPostLikes";

export default function Likes({id, likes}) {
	const token = Cookies.get('token');
	const router = useRouter();
	
	const [incrementPostLikes, { loading, error }] = useMutation(INCREMENT_POST_LIKES, {
		variables: { postId: id },
		context: {
			headers: {
				authorization: token ? `Bearer ${token}` : '',
			},
		},
		update(cache, { data: { incrementPostLikes } }) {
			cache.modify({
				id: cache.identify(id),
				fields: {
					likes(cachedLikes) {
						return incrementPostLikes.post.likes;
					},
				},
			});
		},
	});
	
	const handleLike = () => {
		if (token) {
			incrementPostLikes();
		} else {
			router.push('/login');
		}
	};
	
	return (
		<div className="post">
			<button onClick={handleLike} disabled={loading} className="like-button">
				{loading ? 'Liking...' : `Like (${likes})`}
			</button>
			{error && <p style={{ color: 'red' }}>Error liking post: {error.message}</p>}
		</div>
	);
}
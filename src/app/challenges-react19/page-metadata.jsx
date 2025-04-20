import * as React from "react";
import { Blog } from "~/components";

export function PageMetadata({ post }) {
	return (
		<Blog.Post>
			<meta name="description" content={post.description} />
			<title>{post.title}</title>
			<Blog.Header>
				<Blog.Title>{post.title}</Blog.Title>
				<Blog.PublishDate>{post.publishDate}</Blog.PublishDate>
			</Blog.Header>
			<Blog.Content content={post.content} />
		</Blog.Post>
	);
}

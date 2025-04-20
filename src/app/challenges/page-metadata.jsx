import * as React from "react";
import { Blog } from "~/components";

export function PageMetadata({ post }) {
	// need to get these into the <head> 🤔
	// <meta name="description" content={post.description} />
	// <title>{post.title}</title>
	return (
		<Blog.Post>
			<Blog.Header>
				<Blog.Title>{post.title}</Blog.Title>
				<Blog.PublishDate>{post.publishDate}</Blog.PublishDate>
			</Blog.Header>
			<Blog.Content content={post.content} />
		</Blog.Post>
	);
}

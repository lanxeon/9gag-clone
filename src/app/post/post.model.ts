export interface Post {
    _id: string,
    title: string,
    contentPath: string,
    upvotes: number,
    downvotes: number,
    comments: number,
    poster: string
}

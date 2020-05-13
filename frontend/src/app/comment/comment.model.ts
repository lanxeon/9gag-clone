export interface Comment {
    _id: string,
    content: string,
    count: {
        upvotes: number,
        downvotes: number,
        replies: number
    },
    post: string,
    commenterId: string,
    commenterUsername: string,
    voteStatus?: string
}

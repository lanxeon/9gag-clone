export interface Comment {
    _id: string,
    content: string,
    count: {
        upvotes: number,
        downvotes: number,
        replies: number
    },
    post: string,
    commenter: {
        _id: string,
        username: string,
        dp: string
    },
    voteStatus?: string
}

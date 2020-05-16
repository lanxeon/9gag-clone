export interface Post {
    _id: string,
    title: string,
    contentPath: string,
    contentType: string,
    count: {
        upvotes: number,
        downvotes: number,
        comments: number
    },
    upvotes: [{upvoter: string}]
    poster: {
        _id: string,
        username: string,
        dp: string
    },
    posterId?: string,
    posterUsn?: string,
    category: string,
    voteStatus?: string
};

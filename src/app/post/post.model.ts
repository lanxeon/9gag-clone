export interface Post {
    _id: string,
    title: string,
    contentPath: string,
    count: {
        upvotes: number,
        downvotes: number,
        comments: number
    },
    upvotes: [{upvoter: string}]
    posterId: string,
    posterUsn: string,
    voteStatus?: string
};

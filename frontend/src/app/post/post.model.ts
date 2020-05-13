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
    posterId: string,
    posterUsn: string,
    category: string,
    voteStatus?: string
};

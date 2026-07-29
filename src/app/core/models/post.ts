export interface Post {
    title: string;
    content: string;
    imageUrl: string;
    type: 'general' | 'evento' | 'banda' | 'noticia';
    author: string;
    event: string;
    isActive: boolean;
}
export interface ResponsePosts {
    msg: string;
    data: [Post]
}
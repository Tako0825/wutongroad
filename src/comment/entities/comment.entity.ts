export class Comment {
    uuid: string
    content: string
    create_time: Date
    user_id: string
    topic_id: string   
    parent_id?: string
}

import { Topic } from '@prisma/client';

export class UpdateTopicDto implements Partial<Topic> {
    title?: string
    content?: string
    category_id?: string
}

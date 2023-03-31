import { Module, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostSchema } from './entities/post.entity';
import { UtilService } from 'src/utils/utils.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, UtilService],
  imports: [MongooseModule.forFeature([
    { name: Posts.name, schema: PostSchema },
  ]),]
})
export class PostsModule { }
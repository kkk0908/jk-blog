import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UtilService } from 'src/utils/utils.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Posts, PostDocument } from './entities/post.entity';
import * as messages from '../constants/messages.json'


@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private readonly postModel: Model<PostDocument>,
    private readonly utilService: UtilService) { }

  async createPost(createPostDto: CreatePostDto, createdBy: string): Promise<{ data: Posts, message: string }> {
    try {
      let isExistedTitle = await this.postModel.findOne({ title: createPostDto.title })
      if (isExistedTitle) throw new BadRequestException(`${createPostDto.title} Title is already used!`)
      let result: any = await new this.postModel({
        ...createPostDto,
        createdBy: createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).save();
      console.log(result)
      return { data: result, message: messages.SUCCESS.CREATE }
    } catch (error) {
      console.log(error)
      if (error.error !== 500) {
        return error
      } else {
        throw new InternalServerErrorException(messages.FAILED.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async findAllPosts(): Promise<Posts[]> {
    try {
      return await this.postModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(messages.FAILED.INTERNAL_SERVER_ERROR)
    }
  }

  async findOnePost(id: string): Promise<Posts> {
    try {
      if (!await this.utilService.checkValidMongoDBId(id)) throw new NotFoundException(messages.FAILED.INVALID_ID)
      let postObj = await this.postModel.findById(id).exec();
      if (postObj) return postObj
      throw new NotFoundException(messages.FAILED.NOT_FOUND)
    } catch (error) {
      if (error.error !== 500) {
        return error
      } else {
        throw new InternalServerErrorException(messages.FAILED.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService 
  ) {}

  // 1. REGISTER
  @Post('register')
  async register(@Body() body: any) {
    return await this.prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
  }

  // 2. LOGIN
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (user && user.password === body.password) {
      return {
        token: this.jwtService.sign({ userId: user.id }),
        user,
      };
    }
    return { error: 'Invalid credentials' };
  }

  // 3. CREATE TWEET
  @Post('tweet')
  async createTweet(@Body() body: any) {
    return await this.prisma.post.create({
      data: {
        content: body.content,
        authorId: body.userId, 
      },
    });
  }

  // 4. RETWEET
  @Post('retweet')
  async retweet(@Body() body: any) {
    return await this.prisma.post.create({
      data: {
        content: "Retweet", 
        authorId: body.userId,
        originalPostId: body.postId
      }
    })
  }

  // 5. GET FEED (All posts)
  @Get('feed')
  async getFeed() {
    return await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { 
        author: true, 
        likes: true,
        originalPost: { include: { author: true } } // Include original if it's a retweet
      },
    });
  }

// 6. TOGGLE LIKE (Fixes the multiple likes issue)
  @Post('like')
  async likePost(@Body() body: any) {
    const userId = Number(body.userId);
    const postId = Number(body.postId);

    // 1. Check if this user already liked this specific post
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (existingLike) {
      // 2. If found, DELETE it (Unlike)
      return await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // 3. If NOT found, CREATE it (Like)
      return await this.prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });
    }
  }

  // 7. USER PROFILE
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return await this.prisma.user.findUnique({
      where: { id: Number(id) },
      include: { posts: true }
    });
  }
  // 8. DELETE TWEET
@Delete('tweet/:id')
async deleteTweet(@Param('id') id: string, @Body() body: any) {
  const postId = Number(id);
  const userId = Number(body.userId);

  // 1. Find the post to check who owns it
  const post = await this.prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) return { error: 'Post not found' };

  // 2. Security Check: Do the IDs match?
  if (post.authorId !== userId) {
    return { error: 'You cannot delete other people\'s tweets!' };
  }

  // 3. Delete it
  return await this.prisma.post.delete({
    where: { id: postId },
  });
}
}
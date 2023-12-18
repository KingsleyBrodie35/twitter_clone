//used for creating api route endpoints to use in our client side typescript

import { clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/api"
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

//filter information we can access in front end for users
const filterUserClientData = (user: User) => {
  return {id: user.id, username: user.username, imageUrl: user.imageUrl}
}

export const postsRouter = createTRPCRouter({
  //get Posts
  getAll: publicProcedure.query(async ({ ctx }) => {
    //return first 100 posts
    const posts = await ctx.db.post.findMany({
      take: 100
    })
    //return all userIds associated with first 100 posts
    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.AuthorId),
      limit: 100
    })).map(filterUserClientData)
    //return post & user associated with post
    return posts.map((post) => {
      const author = users.find((user) => post.AuthorId === user.id)
      if (!author) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "author for post not found"
      })
      return({post, author})
    }
    )
  }),
});

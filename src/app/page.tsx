"use client";
import { useState } from 'react';
import  { api }  from "~/trpc/server";
import { UserButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { Spinner } from "~/app/_components/spinner"
import { RouterOutputs } from '~/trpc/shared';

dayjs.extend(relativeTime);

function CreatePostWizard() {
  // Your component logic
  return (
    <>
    <UserButton afterSignOutUrl="/"/>
    <input className="bg-transparent w-full" placeholder="post something.."></input>
    </>
  );
}

//define the instance type of Post
type PostWithUser = RouterOutputs["post"]["getAll"][number]
function PostView(props: PostWithUser) {
  const {post, author} = props
  return (
    <div className="flex flex-row items-center gap-2 border-y border-slate-400 p-2">
              <img className="w-8 h-8 rounded-full gap-4"src={author.imageUrl}/>
            <div>
              <div className="flex flex-row gap-2">
                <p>{`@${author.firstName}${author.lastName}`}</p>
                <p className="font-thin">{dayjs(post.createdAt).fromNow()}</p>
              </div>
              <p>{post.content}</p>
            </div>
    </div>
  )
}

export default async function Home() {
  let response;
  let isLoading;
  try {    
    response = await api.post.getAll.query()
  } catch (e) {
    console.log(e)
  } finally {
    // isPostLoading(false)
  }
  return (
    <main className="flex justify-center h-screen">
      {/* Clerk profile button */}
      <div className="w-full md:max-w-2xl border-x border-slate-400">
        <div className="w-full p-2 flex flex-column gap-2">
          <CreatePostWizard/>
        </div>
        <div className="gap-4">
        {/* {isLoading? (
          <Spinner/>
        ) : (
          <p>loaded</p>
        )} */}
        {response?.map((post) => (
          <PostView {...post}></PostView>
        ))}
        </div>
        
      </div>
    </main>
  );
}
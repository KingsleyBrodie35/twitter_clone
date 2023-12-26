"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { Spinner } from "~/app/_components/spinner"
import { api } from "~/trpc/server";
import { RouterOutputs } from '~/trpc/shared';
import { trpc } from "~/utils/trpc";


dayjs.extend(relativeTime);

//Have to implement Author interface
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

export default function Home() {
  const { data, isLoading, error } = trpc.post.getAll.useQuery()
  
  if (isLoading) return <Spinner></Spinner>
   
  return (
    <main className="flex justify-center h-screen">
      {/* Clerk profile button */}
      <div className="w-full md:max-w-2xl border-x border-slate-400">
        <div className="w-full p-2 flex flex-column gap-2">
          <CreatePostWizard/>
        </div>
        <div className="gap-4">
        {data?.map((post) => (
          <PostView {...post}></PostView>
        ))}
        </div>
      </div>
    </main>
  );
}
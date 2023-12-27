"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { LoadingSpinner, Spinner } from "~/app/_components/spinner"
import { api } from "~/trpc/server";
import { RouterOutputs } from '~/trpc/shared';
import { trpc } from "~/utils/trpc";


dayjs.extend(relativeTime);

//Have to implement Author interface
function CreatePostWizard() {
  // Your component logic
  return (
    <div className="flex flex-row p-2 border-b border-slate-400">
    <UserButton afterSignOutUrl="/"/>
    <input className="pl-2 bg-transparent w-full" placeholder="post something.."></input>
    </div>
  );
}

//define the instance type of Post
type PostWithUser = RouterOutputs["post"]["getAll"][number]
function PostView(props: PostWithUser) {
  const {post, author} = props
  return (
    <div className="flex flex-row items-center gap-2 border-b border-slate-400 p-2">
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

function Feed() {
  //get post query
  const { data, isLoading: PostLoading } = trpc.post.getAll.useQuery()

  if (PostLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <div className="w-full flex flex-col">
    {data?.map((post) => (
      <PostView {...post}></PostView>
    ))}
    </div>
  )
}

export default function Home() {
  //start fetching data asap and cache
  trpc.post.getAll.useQuery()
  return (
    <main className="flex justify-center h-screen">
      <div className="w-full md:max-w-2xl border-x border-slate-400">
        <div className="w-full">
          <CreatePostWizard/>
          <Feed/>
      </div>
      </div>
    </main>
  );
}
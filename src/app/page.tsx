import Link from "next/link";

import  { api }  from "~/trpc/server";
import { UserButton, useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

function CreatePostWizard() {
  // Your component logic
  return (
    <>
    <UserButton afterSignOutUrl="/"/>
    <input className="bg-transparent w-full" placeholder="post something.."></input>
    </>
  );
}

export default async function Home() {
  let response;
  try {
    response = (await api.post.getAll.query())
  } catch (e) {
    console.log(e)
  }
  console.log(response)
  return (
    <main className="flex justify-center h-screen">
      {/* Clerk profile button */}
      <div className="w-full md:max-w-2xl border-x border-slate-400">
        <div className="w-full p-2 flex flex-column gap-4">
          <CreatePostWizard/>
        </div>
        <div>
        {response?.map((post, author) => (
          <>
          <div>{post.post.content}</div>
          <img src={post.author.imageUrl}/>
          <div>{post.author.username}</div>
          </>
        ))}
        </div>
      </div>
    </main>
  );
}
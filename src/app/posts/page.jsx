"use client";

import {Card, CardHeader, CardBody, Image, Link, Button} from "@nextui-org/react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const Posts = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState();

    useEffect(() => {
        if (status === "authenticated") {
            fetch(`/api/posts?userId=${session.user.id}`).then(res => res.json()).then(data => setPosts(data.data));
        }
    }, [status, session]);

    const deletePost = async (postId) => {
        await fetch(`/api/posts/${postId}`, {
            method: "DELETE"
        });
        setPosts(posts.filter(post => post.id !== postId));
    }

    return (
        <section className="mb-12">
            <div>
                <h1 className="text-xl font-bold text-default-900 lg:text-3xl">My Post</h1>
                <p className="text-small text-default-400 lg:text-medium">List all of your posts</p>
            </div>

            <div className="mt-12 flex flex-col gap-8">
                {posts && posts.map(post => (
                    <Card key={post.id} shadow="none" className="border-2">
                        <CardHeader>
                            <div className="flex items-center relative w-full">
                                <Image src="http://localhost:3000/assets/Capstone_Cart_(3).png" height={128} width={128} alt="avatar" className="rounded-lg h-32 w-32 aspect-square flex-grow" />
                                <div className="ml-4 w-3/4">
                                    <h3 className="text-default-900 font-bold">{ post.title }</h3>
                                    <p className="text-default-400 text-sm">{ moment(post.created_at).fromNow() }</p>
                                    <p className="text-sm text-justify mt-2">{ post.description }</p>
                                </div>
                                <Link href={`/posts/${post.id}`} target="_blank" className="text-primary-500 text-sm flex gap-1 absolute top-0 right-0">
                                    view
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="flex justify-end">
                                <Button as={Link} href={`/posts/${post.id}/update`} color="primary" className="mr-2 px-8">Update</Button>
                                <Button color="danger" onClick={() => {deletePost(post.id)}} className="mr-2 px-8">Delete</Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </section>  
    );
}
 
export default Posts;
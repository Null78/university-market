"use client";

import { Button, Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    fetch('/api/posts', {
      cache: 'no-cache',
    }).then((res) => res.json()).then((data) => {
      console.log(data.data)
      setPosts(data.data);
    });
  }, []);


  return (
    <>
    <div className="py-20 text-start flex gap-8">
      <div className="max-w-xl w-full mx-auto px-4">
        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
          The UPM Marketplace
        </h1>
        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
          Buy and Sell Books & Items
        </h1>
        <p className="text-sm lg:text-base mt-4">
          Connect with fellow students to buy and sell textbooks,
          electronics, and more. Join our community and find great deals
          on items you need for your studies.
        </p>
        <div className="mt-6 flex justify-start space-x-4">
          <Link href="/posts/create">
            <Button color="primary" size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
      <Image src="/assets/main.png" alt='Main Image' className='w-full object-contain' />
    </div>

    <div className='py-16'>
      <h4 className='font-bold text-xl pb-6'>Latest Listings</h4>
      <div className='grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12'>
        {posts && posts.map((post: any) => (
            <Card shadow="sm" key={post.id} className="py-4" >
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start mx-auto">
                <Image src={post.postMedia?.length > 0 ? post.postMedia[0].media.path : 'https://placehold.co/600x600/png?text=placeholder'} alt={post.title} className='w-full mx-auto object-contain aspect-square rounded-xl' />
                <h4 className='font-bold capitalize pt-4'>{post.title}</h4>
              </CardHeader>
              <CardBody className="flex flex-col gap-4 py-2">
                <p className='text-gray-600 text-sm'>
                  { post.description }
                </p>
                <Link href={`/posts/${post.id}`} className='w-full block'>
                  <Button color='primary' variant='flat' className='block w-full'>View Post</Button>
                </Link>
              </CardBody>
            </Card>
        ))}
      </div>
    </div>
 </>
  );
}

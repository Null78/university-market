"use client";

import { useEffect, useState } from "react";
import { Image, Button, Input, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Post = ({ params }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [data, setData] = useState();
    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      };

    useEffect(() => {
        fetch(`/api/posts/${params.id}`, {
            params: {
                user_id: session?.user?.id,
            },
        }).then(res => res.json()).then(data => {
            setData(data);
        });
    }, [params.id, status, session])

    const parseLocation = (location) => {
        switch (location) {
          case 'male':
            return 'Male Campus';
          case 'female':
            return 'Female Campus';
          default:
            return 'Other';
        }
    };

    const reportPost = async () => {
        await fetch(`/api/report`, {
            method: "POST",
            body: JSON.stringify({
                reported_id: data.id,
                reporter_id: session.user.id,
                type: 'Fake Post',
            }),
        });
    }

    return (
        <section className="flex gap-8 py-20">
            {data && (
                <>
                    <div className="w-1/2">
                    <Slider className="border px-4 rounded-xl shadow-sm mx-auto" {...settings}>
                        {data.postMedia.length > 0 ? data.postMedia.map(media => (
                            <div key={media.media.id}>
                                <Image className="h-96 object-contain" src={media.media.path} alt={data.title} />
                            </div>
                        )) : (
                            <div className="mx-auto">
                                <Image className="h-96 object-contain mx-auto" src="https://placehold.co/600x600/png?text=placeholder" alt={data.title} />
                            </div>
                        )}
                    </Slider>
                    </div>
                    <div className="w-1/2 flex flex-col gap-6 relative">
                        <h1 className="text-4xl capitalize">
                            { data.title }
                            { session?.user && (
                                <Button onPress={onOpen} variant="link" className="absolute top-0 right-0 text-red-500 text-sm flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                    Report
                                </Button>
                            )}
                        </h1>
                        <p className="text-gray-600 text-justify">{ data.description }</p>
                        <p className='text-sm text-gray-600 gap-2 flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>

                            <span className='font-medium text-black'>
                                Level:
                            </span>
                            {data.level}
                        </p>
                        <p className='flex gap-2 text-sm text-gray-600'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>

                            <span className='font-medium text-black'>
                                Location:
                            </span>
                            {parseLocation(data.location)}
                        </p>
                        <div className="flex gap-6">
                            {
                                data.user.phone && (
                                    <>
                                        <Link href={`tel:${data.user.phone}`} target="_blank">
                                            <Button color="primary" className="px-8 gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                                </svg>
                                                Call
                                            </Button>
                                        </Link>
                                        <Link href={`https://wa.me/${data.user.phone}`} target="_blank">
                                            <Button color="success" className="px-8">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.471-.148-.67.15c-.197.297-.767.966-.94 1.164c-.173.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52s.198-.298.298-.497c.099-.198.05-.371-.025-.52s-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074s2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625c.712.227 1.36.195 1.871.118c.571-.085 1.758-.719 2.006-1.413s.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214l-3.741.982l.998-3.648l-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884c2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413"></path></svg>
                                                WhatsApp
                                            </Button>
                                        </Link>
                                    </>
                                )
                            }
                            
                        </div>
                    </div>
                </>
            )}

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Report Post</ModalHeader>
                    <ModalBody>
                        <p>are you sure you want to report this post?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="light" onPress={onClose}>
                        Close
                        </Button>
                        <Button color="danger" onPress={onClose} onClick={reportPost}>
                        Report
                        </Button>
                    </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
        </section>
    );
}
 
export default Post;
"use client";

import { useState } from "react";
import { Textarea, Button, Input, Link, Select, SelectItem } from "@nextui-org/react";
import { FilePond } from 'react-filepond';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


function CreatePost() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [level, setLevel] = useState(new Set([]));
    const [location, setLocation] = useState(new Set([]));
    const [files, setFiles] = useState([])

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(title, description, level, location, files)

        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                level: Array.from(level)[0],
                location: Array.from(location)[0],
                user_id: session.user.id,
                media: files.map(file => file.serverId)
            })
        });
        const data = await response.json();

        if (data.success) {
            router.push("/posts");
            router.refresh();
        }
    }

    return (
        <section className="">
            <div>
                <h1 className="text-xl font-bold text-default-900 lg:text-3xl">Create Post</h1>
                <p className="text-small text-default-400 lg:text-medium">Publish a post to sell your items in the university</p>
            </div>

            <div className="mt-12">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                        <Input
                            type="text"
                            label="Book title"
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Enter the title of your book"
                            onValueChange={setTitle}
                            isRequired
                        />
                    </div>
                    <div>
                        <Select
                            label="Level"
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Select the level of the book"
                            selectedKeys={level}
                            onSelectionChange={setLevel}
                            isRequired>
                                <SelectItem key="000" value="000">000</SelectItem>
                                <SelectItem key="001" value="001">001</SelectItem>
                                <SelectItem key="002" value="002">002</SelectItem>
                                <SelectItem key="003" value="003">003</SelectItem>
                                <SelectItem key="004" value="004">004</SelectItem>
                                <SelectItem key="005" value="005">005</SelectItem>
                        </Select>
                    </div>
                    <div>
                        <Select
                            label="Location"
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Select the location of the book"
                            selectedKeys={location}
                            onSelectionChange={setLocation}
                            isRequired>
                                <SelectItem key="male" value="male-campus">Male Campus</SelectItem>
                                <SelectItem key="female" value="female-campus">Female Campus</SelectItem>
                                <SelectItem key="other" value="other">Other</SelectItem>
                        </Select>
                    </div>
                    <div className="w-full lg:col-span-2">
                        <Textarea
                            label="Description"
                            variant="bordered"
                            labelPlacement="outside"
                            placeholder="Enter the description of your book"
                            onValueChange={setDescription}
                            isRequired
                        />
                    </div>
                    <div>
                    <label className="z-10 pointer-events-none origin-top-left subpixel-antialiased block text-small text-foreground-500 after:content-['*'] after:text-danger after:ml-0.5 relative will-change-auto !duration-200 !ease-out motion-reduce:transition-none transition-[transform,color,left,opacity] group-data-[filled-within=true]:text-foreground group-data-[filled-within=true]:pointer-events-auto pb-1.5 pe-2 max-w-full text-ellipsis overflow-hidden">
                        Images
                    </label>
                    <FilePond
                        files={files}
                        onupdatefiles={setFiles}
                        allowMultiple={true}
                        maxFiles={3}
                        server={{
                            process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
                                // fieldName is the name of the input field
                                // file is the actual file object to send
                                const formData = new FormData();
                                formData.append(fieldName, file, file.name);
                                formData.append('user_id', session.user.id);

                                const request = new XMLHttpRequest();
                                request.open('POST', '/api/media');
                                request.upload.onprogress = (e) => {
                                    progress(e.lengthComputable, e.loaded, e.total);
                                };

                                request.onload = function () {
                                    const response = JSON.parse(request.responseText);
                                    if (request.status >= 200 && request.status < 300 && response.success && response.message !== "Failed") {
                                        load(response.data.id);
                                    } else {
                                        error('oh no');
                                    }
                                };

                                request.send(formData);

                                return {
                                    abort: () => {
                                        request.abort();
                                        abort();
                                    },
                                };
                            
                            },
                            onload: (response) => {
                                console.log(response);
                            }
                        }}
                        name="file"
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                    </div>
                    <div className="flex w-full col-span-1 gap-4">
                        <Button type="submit" color="primary" className="w-full text-sm">
                            Create
                        </Button>
                        <Button as={Link} href="/posts" color="default" variant="flat" className="w-full text-sm">
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default CreatePost;
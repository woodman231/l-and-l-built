import React from 'react'
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { createOneInputValidator, type CreateOneUserBookMarkInput } from "~/features/userBookMarks/validators/createOneInputValidator";
import { type UseFormReturn } from "react-hook-form"
import Link from "next/link";

function CreateUserBookMarkPage() {
    const { data: sessionData, status } = useSession();
    const { mutate, data, error, isLoading } = api.userBookMarks.createOne.useMutation();

    const defaultValues: CreateOneUserBookMarkInput = {
        name: "",
        url: ""
    }

    const formMethods: UseFormReturn<CreateOneUserBookMarkInput> = useForm<CreateOneUserBookMarkInput>({
        resolver: zodResolver(createOneInputValidator),
        defaultValues
    });

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e: React.FormEvent<HTMLFormElement>) => {
        void formMethods.handleSubmit((formData) => {
            mutate(formData);
        })(e);
    }

    const onResetClickHandler: React.MouseEventHandler<HTMLInputElement> = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault();
        formMethods.reset(defaultValues);
    }

    if(isLoading) {
        return (
            <p>Saving BookMark...</p>
        )
    }

    if(error) {
        return (
            <p className='m-4'>Something went wrong {JSON.stringify(error)}</p>
        )
    }

    if(data) {
        return(
            <div className="m-4">
                <p>The BookMark has been created successfully!</p>
                <BackToListLink />
            </div>
        )
    }

    if (sessionData && sessionData.user && status === "authenticated") {
        return (
            <>
                <div className='m-4'>
                    <h1>Create User Bookmark</h1>
                    <form className='flex flex-col' onSubmit={onSubmitHandler}>
                        <div className='flex flex-col'>
                            <label className='block'>Name</label>
                            <input className='border border-black' {...formMethods.register("name")} />
                            {
                                formMethods.formState.errors.name?.message && <p className='text-red-500'>{formMethods.formState.errors.name.message.toString()}</p>
                            }
                        </div>
                        <div className='flex flex-col'>
                            <label className='block'>Url</label>
                            <input className='border border-black' {...formMethods.register("url")} />
                            {
                                formMethods.formState.errors.url?.message && <p className='text-red-500'>{formMethods.formState.errors.url.message.toString()}</p>
                            }
                        </div>
                        <div>
                            <input type="submit" value="Create" className='bg-green-500 text-blue-50 mt-4 rounded border border-green-800 p-2 inline-block cursor-pointer' />
                            <input type="button" value="Reset" className='bg-gray-500 text-gray-50 mt-4 rounded border border-gray-800 p-2 inline-block cursor-pointer ml-4' onClick={onResetClickHandler} />
                        </div>
                    </form>
                    <div className='mt-4'>
                        <BackToListLink />
                    </div>                    
                </div>
            </>
        )
    }

    return (
        <p>You are not logged in. Return to the <Link href="/">home page</Link></p>
    )
}

function BackToListLink() {
    return (
        <Link className='underline text-blue-500' href="/bookmarks">&lt;- Back to list</Link>
    )
}

export default CreateUserBookMarkPage
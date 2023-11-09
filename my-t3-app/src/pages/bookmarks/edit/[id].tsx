import React from 'react'
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { getOneInputValidator } from "~/features/userBookMarks/validators/getOneInputValidator";
import { updateOneInputValidator, type UpdateOneUserBookMarkInput } from "~/features/userBookMarks/validators/updateOneInputValidator";
import { type UseFormReturn } from "react-hook-form"
import Link from "next/link";

function EditBookMarkPage() {

    const { data: sessionData, status } = useSession();
    const router = useRouter();
    const { id } = router.query;

    const isValidIdParams = getOneInputValidator.safeParse({id}).success;

    if (!isValidIdParams) {
        return (
            <p>The id that was provided in the URL is not valid.</p>
        )
    }

    if (sessionData && sessionData.user && status === "authenticated") {
        return (
            <EditBookMarkFormLoader bookMarkId={id as string} />
        )
    }

    return (
        <p>You are not logged in. Return to the <Link href="/">home page</Link></p>
    )
}

function EditBookMarkFormLoader({ bookMarkId }: { bookMarkId: string }) {
    const { data: currentBookMarkDetailsData, isFetching: currentBookMarkDetailsAreFetching, error: fetchCurrentBookMarkDetailsError } = api.userBookMarks.getOne.useQuery({ id: bookMarkId });

    if (currentBookMarkDetailsAreFetching) {
        return (
            <p>Loading...</p>
        )
    }

    if (fetchCurrentBookMarkDetailsError) {
        return (
            <p>Something went wrong loading the book mark details {JSON.stringify(fetchCurrentBookMarkDetailsError)}</p>
        )
    }

    if (currentBookMarkDetailsData) {
        const defaultValues: UpdateOneUserBookMarkInput = {
            id: currentBookMarkDetailsData.id,
            name: currentBookMarkDetailsData.name,
            url: currentBookMarkDetailsData.url
        };

        return (
            <EditBookMarkForm defaultValues={defaultValues} />
        )
    }
}

function EditBookMarkForm({ defaultValues }: { defaultValues: UpdateOneUserBookMarkInput }) {
    const { mutate, data, error, isLoading } = api.userBookMarks.updateOne.useMutation();

    const formMethods: UseFormReturn<UpdateOneUserBookMarkInput> = useForm<UpdateOneUserBookMarkInput>({
        resolver: zodResolver(updateOneInputValidator),
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
            <p className='m-4'>Saving BookMark...</p>
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
                <p>The BookMark has been saved successfully!</p>
                <BackToListLink />
            </div>
        )
    }

    return (
        <>
            <div className='m-4'>
                <h1>Update User Bookmark</h1>
                <form className='flex flex-col' onSubmit={onSubmitHandler}>
                    <input type="hidden" {...formMethods.register("id")} />
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
                        <input type="submit" value="Save" className='bg-green-500 text-blue-50 mt-4 rounded border border-green-800 p-2 inline-block cursor-pointer' />
                        <input type="button" value="Reset" className='bg-gray-500 text-gray-50 mt-4 rounded border border-gray-800 p-2 inline-block cursor-pointer ml-4' onClick={onResetClickHandler} />
                    </div>
                </form>
                <div className='mt-4'>
                    <Link className='underline text-blue-500' href="/bookmarks">&lt;- Back to list</Link>
                </div>
            </div>
        </>
    )
}

function BackToListLink() {
    return (
        <Link className='underline text-blue-500' href="/bookmarks">&lt;- Back to list</Link>
    )
}

export default EditBookMarkPage
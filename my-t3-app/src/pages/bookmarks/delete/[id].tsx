import React from 'react'
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { getOneInputValidator } from "~/features/userBookMarks/validators/getOneInputValidator";
import Link from "next/link";

function DeleteBookMarksPage() {
    const { data: sessionData, status } = useSession();
    const router = useRouter();
    const { id } = router.query;

    const isValidIdParams = getOneInputValidator.safeParse({ id }).success;

    if (!isValidIdParams) {
        return (
            <p>The id that was provided in the URL is not valid.</p>
        )
    }

    if (sessionData && sessionData.user && status === "authenticated") {
        return (
            <DeletBookMarkForm bookMarkId={id as string} />
        )
    }

    return (
        <p>You are not logged in. Return to the <Link href="/">home page</Link></p>
    )
}

function DeletBookMarkForm({ bookMarkId }: { bookMarkId: string }) {
    const { data: currentBookMarkDetailsData, isFetching: currentBookMarkDetailsAreFetching, error: fetchCurrentBookMarkDetailsError } = api.userBookMarks.getOne.useQuery({ id: bookMarkId });
    const { mutate, isLoading: isDeleting, isSuccess: isDeleteSuccessfull } = api.userBookMarks.deleteOne.useMutation();

    const onDeleteClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        mutate({ id: bookMarkId });
    }

    if (currentBookMarkDetailsAreFetching) {
        return (
            <p className='m-4'>Loading BookMark details...</p>
        )
    }

    if (fetchCurrentBookMarkDetailsError) {
        return (
            <div className='m-4'>
                <p>Something went wrong loading the book mark details {JSON.stringify(fetchCurrentBookMarkDetailsError)}</p>
                <BackToListLink />
            </div>
        )
    }

    if (isDeleting) {
        return (
            <p className='m-4'>Deleting BookMark...</p>
        )
    }

    if (isDeleteSuccessfull) {
        return (
            <div className='mt-4'>
                <p>The BookMark has been delete</p>
                <BackToListLink />
            </div>
        )
    }

    if (currentBookMarkDetailsData) {
        return (
            <div className='m-4'>
                <p>Are you sure that you want to delete this BookMark?</p>
                <dl>
                    <dt className='font-bold mt-1'>ID</dt>
                    <dd className='ml-4'>{currentBookMarkDetailsData.id}</dd>

                    <dt className='font-bold mt-1'>Name</dt>
                    <dd className='ml-4'>{currentBookMarkDetailsData.name}</dd>

                    <dt className='font-bold mt-1'>URL</dt>
                    <dd className='ml-4'>{currentBookMarkDetailsData.url}</dd>
                </dl>
                <button
                    className="bg-red-500 text-red-50 mt-4 rounded border border-red-800 p-2 inline-block cursor-pointer"
                    onClick={onDeleteClickHandler}>
                    Delete
                </button>
                <div className='mt-4'>
                    <BackToListLink />
                </div>
            </div>
        )
    }
}

function BackToListLink() {
    return (
        <Link className='underline text-blue-500' href="/bookmarks">&lt;- Back to list</Link>
    )
}

export default DeleteBookMarksPage
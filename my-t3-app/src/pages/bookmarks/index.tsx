import React from 'react'
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";

function UserBookMarksHomePage() {
  const { data: sessionData, status } = useSession();

  const { isFetching, data: bookMarksList } = api.userBookMarks.getList.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      refetchOnMount: true
    }
  );

  if (isFetching || status === "loading") {
    return (
      <p className='m-4'>Loading...</p>
    )
  }

  if (sessionData && sessionData.user && (bookMarksList !== null && bookMarksList !== undefined)) {
    return (
      <div className='m-4'>
        <div>
          <h1>Welcome, {sessionData.user.name}. Here are your bookmarks:</h1>
        </div>
        <div className='mt-4'>
          <CreateOneLink />          
        </div>
        <div className='mt-4'>
          <DisplayBookMarksList bookMarksList={bookMarksList} />
        </div>
        <div className='mt-4'>
          <p>Return to the <Link className='underline text-blue-400' href="/">home page</Link></p>
        </div>
      </div>
    )
  }

  return (
    <p>You are not logged in. Return to the <Link href="/">home page</Link></p>
  )
}

function DisplayBookMarksList({ bookMarksList }: { bookMarksList: { id: string, name: string, url: string }[] | undefined }) {
  if (!bookMarksList || bookMarksList.length === 0) {
    return (
      <p>You have no Book Marks.</p>
    )
  }

  return (
    <table className='border border-black'>
      <thead>
        <tr>
          <th className='border border-black p-2'>Name</th>
          <th className='border border-black p-2'>URL</th>
          <th className='border border-black p-2'>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {
          bookMarksList.map((bookMarkListItem) => {
            return (
              <tr key={bookMarkListItem.id}>
                <td className='border border-black p-2'>{bookMarkListItem.name}</td>
                <td className='border border-black p-2'><Link className='underline text-blue-500' href={bookMarkListItem.url} target='_blank'>{bookMarkListItem.url}</Link></td>
                <td className='border border-black p-2'>
                  <Link className='underline text-blue-500' href={`/bookmarks/edit/${bookMarkListItem.id}`}>Edit</Link>
                  {' | '}
                  <Link className='underline text-blue-500' href={`/bookmarks/delete/${bookMarkListItem.id}`}>Delete</Link>
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )

}

function CreateOneLink() {
  return (
    <Link className='bg-green-500 text-blue-50 rounded border border-green-800 p-2 inline-block' href="/bookmarks/create">Create a new one</Link>
  )
}

export default UserBookMarksHomePage
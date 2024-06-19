// @ts-nocheck
"use client";

import { useGetCalls } from '@/hooks/useGetCalls'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { CallRecording, Call } from '@stream-io/video-react-sdk'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from './ui/use-toast';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    const { isLoading, endedCalls, upComingCalls, CallRecordings } = useGetCalls()
    const router = useRouter()
    const [recordings, setRecordings] = useState<CallRecording[]>([])
    const { toast } = useToast()

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls
            case 'upcoming':
                return upComingCalls
            case 'recordings':
                return recordings
            default:
                return []
        }
    }
    const getNocallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No previous Calls'
            case 'upcoming':
                return "no upcoming calls"
            case 'recordings':
                return 'no recordings available'
            default:
                return ''
        }
    }

    useEffect(() => {
        const fetchRecording = async () => {
            try {
                const callData = await Promise.all(CallRecordings.map((meeting) => (meeting.queryRecordings())))
                const recordings = callData.filter(call => call.recordings.length > 0).flatMap(call => call.recordings)
                setRecordings(recordings)
            } catch (error) {
                toast({ title: "Try again later" })
                console.error(error)
            }

        }
        if (type === 'recordings') fetchRecording();
    }, [type, CallRecordings])

    const calls = getCalls();
    const noCallsMessage = getNocallsMessage();

    if (isLoading) return <Loader />

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) =>
            (
                <MeetingCard
                    key={(meeting as Call)?.id}
                    title={(meeting as Call)?.state?.custom?.description?.substring(0, 26) || meeting?.filename?.substring(0, 26) || "Personal Meeting"}
                    date={meeting?.state?.startsAt?.toLocaleString() || new Date(meeting?.start_time).toLocaleString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                    })}
                    icon={type === 'ended' ? '/icons/previous.svg' : type === 'upcoming' ? '/icons/upcoming.svg' : '/icons/recordings.svg'}
                    isPreviousMeeting={type === 'ended'}
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    buttonText={type === 'recordings' ? 'Play' : 'Start Meeting'}
                    link={type === 'recordings' ? meeting?.link : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting?.id}`}
                    handleClick={() => {
                        router.push(type === 'recordings' ? `${meeting?.url}` : `/meeting/${meeting?.id}`);
                    }}
                />)) : (<h1>{noCallsMessage}</h1>)}
        </div>
    )
}

export default CallList

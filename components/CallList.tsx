"use client";

import { useGetCalls } from '@/hooks/useGetCalls'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { CallRecording, Call } from '@stream-io/video-react-sdk'
import MeetingCard from './MeetingCard';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    const { isLoading, endedCalls, upComingCalls, CallRecordings } = useGetCalls()
    console.log('endedCalls', endedCalls);
    console.log('upComingCalls', upComingCalls);
    console.log('CallRecordings', CallRecordings);
    const router = useRouter()
    const [recordings, setRecordings] = useState<CallRecording[]>([])

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

    const calls = getCalls();
    const noCallsMessage = getNocallsMessage();
    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {JSON.stringify(calls)}
            {calls && calls.length > 0 ? calls.map((meeting : Call | CallRecording)=>(<MeetingCard/>)):(<h1>fuc</h1>)}
        </div>
    )
}

export default CallList

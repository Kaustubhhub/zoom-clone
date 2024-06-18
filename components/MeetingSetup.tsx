"use client";

import { VideoPreview, useCall, DeviceSettings } from '@stream-io/video-react-sdk'
import { useEffect, useState } from 'react'
import { Button } from './ui/button';
const MeetingSetup = ({ setisSetUpComplete }: { setisSetUpComplete: (value: boolean) => void }) => {
    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)

    const call = useCall()
    if (!call) {
        throw new Error("useCall must be used within stream call component")
    }
    useEffect(() => {
        if (call) {

            if (isMicCamToggledOn) {
                call.camera.disable().then(() => {
                    console.log('Camera disabled');
                }).catch(error => {
                    console.error('Error disabling camera:', error);
                });
                
                call.microphone.disable().then(() => {
                    console.log('Microphone disabled');
                }).catch(error => {
                    console.error('Error disabling microphone:', error);
                });
            } else {
                call.camera.enable().then(() => {
                    console.log('Camera enabled');
                }).catch(error => {
                    console.error('Error enabling camera:', error);
                });

                call.microphone.enable().then(() => {
                    console.log('Microphone enabled');
                }).catch(error => {
                    console.error('Error enabling microphone:', error);
                });
            }
        }
    }, [isMicCamToggledOn, call]);


    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
            <h1 className="text-2xl font-bold">setup</h1>
            <VideoPreview />
            <div className='flex h-16 items-center justify-center gap-3'>
                <label className='flex items-center justify-center gap-2 font-medium'>
                    <input
                        type="checkbox"
                        checked={isMicCamToggledOn}
                        onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
                    />
                    Join with mic and camera off
                </label>
                <DeviceSettings />
            </div>
            <Button
                className='rounded-md bg-green-500 px-4 py-2.5'
                onClick={() => {
                    call.join();
                    setisSetUpComplete(true)
                }}
            >

                Join Meeting
            </Button>
        </div>
    )
}

export default MeetingSetup

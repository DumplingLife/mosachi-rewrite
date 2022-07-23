import React, {useEffect } from 'react';

export default function MediaNetAd(props) {
    useEffect(() => {
        try {
            window._mNHandle.queue.push(function (){
                window._mNDetails.loadTag("452247345", "160x600", "452247345");
            });
        }
        catch (error) {}
    });

    return (
        <div id="452247345" />
    );
}
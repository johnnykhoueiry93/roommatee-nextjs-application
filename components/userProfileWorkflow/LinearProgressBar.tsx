"use client";

/**
 * Usage
 * In the new component
 * import LinearProgressBar from "./LinearProgressBar";
 * 
 * Define these 2 const
 * const prevProgress = 0;  // where you are now
 * const nextProgress = 10; // how much progress to display to the user when they land on this component
 * 
 * Call it
 * <LinearProgressBar prevProgress={prevProgress} nextProgress={nextProgress}/>
 */

import LinearProgress from '@mui/material/LinearProgress';
import { useState, useEffect } from "react";
import { SiteData } from "../../context/SiteWrapper";
import React from "react";

//@ts-ignore
const LinearProgressBar = () => {
  //@ts-ignore
  const { prevProgress, nextProgress } = SiteData();
    const [progress, setProgress] = useState(prevProgress);

    useEffect(() => {
        const timer = setInterval(() => {
            //@ts-ignore
          setProgress((oldProgress) => {
            if (oldProgress === 100) {
              return 0;
            }
            const diff = Math.random() * 10;
            return Math.min(oldProgress + diff, nextProgress);
          });
        }, 500);
    
        return () => {
          clearInterval(timer);
        };
      }, [prevProgress, nextProgress]);

    return ( 
        <div className='mb-4'>
            <LinearProgress variant="determinate" value={progress} />
        </div>
    )
}

export default LinearProgressBar;
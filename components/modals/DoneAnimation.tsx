"use client";

import lottie from 'lottie-web';
import animationData from '../../public/profile-complete-animation.json'; // Adjust the path as per your file structure
import React, { useEffect } from 'react';

const DoneAnimation = () => {
    useEffect(() => {
        const container = document.getElementById('lottie-container');
    
        if (container) {
          const anim = lottie.loadAnimation({
            container,
            animationData,
            renderer: 'svg', // Choose the renderer (svg, canvas, html)
            loop: true, // Set to true if you want the animation to loop
            autoplay: true, // Set to true to autoplay the animation
          });
    
          return () => {
            anim.destroy(); // Cleanup animation when component unmounts
          };
        }
      }, []);

    return (
      <div id="lottie-container" style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>

    )
}

export default DoneAnimation;
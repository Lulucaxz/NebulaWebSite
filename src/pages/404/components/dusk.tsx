import { useEffect } from "react";
import "./dusk.css";

const DUSK_COUNT = 20;

export function Dusk() {
    useEffect(() => {
        const timer = window.setTimeout(() => {
            for (let i = 0; i < DUSK_COUNT; i++) {
                const element = document.getElementById(`d${i + 1}`);
                if (!element) continue;

                const duration = (Math.random() * 6 + 1).toFixed(3);
                const top = (Math.random() * 99).toFixed(3);
                const left = (Math.random() * 99).toFixed(3);
                const blur = (Math.random() * 2 + 1).toFixed(3);
                element.style.cssText += `animation: ababa ${duration}s infinite;top:${top}%;left:${left}%;-webkit-filter:blur(${blur}px);`;
            }
        }, 100);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            {Array.from({ length: DUSK_COUNT }, (_, i) => (
                <div key={i} className="dusk" id={`d${i + 1}`}></div>
            ))}
        </>
    );
}
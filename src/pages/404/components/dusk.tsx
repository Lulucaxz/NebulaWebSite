import './dusk.css'

export function Dusk() {
    setTimeout(() => {
        for (let i = 0; i < 20; i++) {
            document.getElementById(`d${i + 1}`).style.cssText += `animation: ababa ${(Math.random() * 6 + 1).toFixed(3)}s infinite;top:${(Math.random() * 99).toFixed(3)}%;left: ${(Math.random() * 99).toFixed(3)}%;-webkit-filter:blur(${(Math.random() * 2 + 1).toFixed(3)}px);`
        }
    }, 100)

    return (
        <>
            {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="dusk" id={`d${i + 1}`}></div>
            ))
            }
        </>
    )
}
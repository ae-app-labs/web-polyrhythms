
const paper = document.querySelector("#paper")
const pen = paper.getContext("2d")

let startTime = new Date().getTime()
let soundEnabled = false
const maxLoops = 50
const oneFullLoop = 2 * Math.PI
const realignmentTime = 60 * 15; // 20 minutes

// Disable audio if we the tab is not visible
document.onvisibilitychange = () => {
    soundEnabled = false
    toggleAudioStatus()
}
paper.onclick = () => {
    soundEnabled = !soundEnabled
    toggleAudioStatus()
}

const colors1 = [
    "#D0E7F5",
    "#D9E7F4",
    "#D6E3F4",
    "#BCDFF5",
    "#B7D9F4",
    "#C3D4F0",
    "#9DC1F3",
    "#9AA9F4",
    "#8D83EF",
    "#AE69F0",
    "#D46FF1",
    "#DB5AE7",
    "#D911DA",
    "#D601CB",
    "#E713BF",
    "#F24CAE",
    "#FB79AB",
    "#FFB6C1",
    "#FED2CF",
    "#FDDFD5",
    "#FEDCD1",
]

const colors = [
    "#86FBCC",
    "#8AF3D2",
    "#8DEDD6",
    "#91E5DB",
    "#95DDE1",
    "#98D7E5",
    "#9CCFEB",
    "#9FC8F0",
    "#A3C1F5",
    "#A7B9FA",
    "#AAB2FF",
    "#B0B0FF",
    "#B7AEFF",
    "#BCADFF",
    "#C3ABFF",
    "#CAA9FF",
    "#D0A8FF",
    "#D5A6FF",
    "#DCA4FF",
    "#E2A3FF",
    "#E9A1FF",
]

const toggleAudioStatus = () => {
    if(!soundEnabled){
        document.querySelector("#mute").classList.remove('hidden')
        document.querySelector("#unmute").classList.add('hidden')
    } else {
        document.querySelector("#mute").classList.add('hidden')
        document.querySelector("#unmute").classList.remove('hidden')
    }
}

const calculateNextImpactTime = (currentImpactTime, velocity) => {
    return currentImpactTime + (Math.PI / velocity) * 1000
}

const arcs = colors.map( (color, index) => {
    let audio = new Audio(`assets/audio/key-${index}.wav`)
    audio.volume = 0.2

    const numberOfLoops = oneFullLoop * (maxLoops - index)
    const velocity = numberOfLoops / realignmentTime

    return {
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity
    }
})

// the draw loop
const draw = () => {
    paper.width = paper.clientWidth
    paper.height = paper.clientHeight

    const currentTime = new Date().getTime()
    const elapsedTime = (currentTime - startTime) / 1000

    const start = {
        x:paper.width * 0.1,
        y: paper.height * 0.9
    }

    const end = {
        x:paper.width * 0.9,
        y: paper.height * 0.9
    }

    const center = {
        x: paper.width * 0.5,
        y: paper.height * 0.9
    }

    // Draw the line
    pen.strokeStyle = "#E9A1FF"
    pen.lineWidth = 6

    pen.beginPath()
    pen.moveTo(start.x, start.y)
    pen.lineTo(end.x, end.y)
    pen.stroke()

    // Draw the arcs and circles
    const length = end.x - start.x
    const initialArcRadius = length * 0.05
    const spacing = (length / 2 - initialArcRadius) / arcs.length
    const maxAngle = 2 * Math.PI
    pen.lineWidth = 4
    
    arcs.forEach( (arc, index) => {
        // distance =  time * speed
        const distance = Math.PI + (elapsedTime * arc.velocity)
        const modDistance = distance % maxAngle

        // constrain the circle between PI and 2 PI
        const adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance
        const arcRadius = initialArcRadius + (index * spacing)
        
        // Draw Arc
        pen.beginPath()
        pen.strokeStyle = arc.color
        pen.arc(center.x, center.y, arcRadius, Math.PI, 2 * Math.PI)
        pen.stroke()

        // Calculate the x and y for the arc
        const x = center.x + arcRadius * Math.cos(adjustedDistance)
        const y = center.y + arcRadius * Math.sin(adjustedDistance)

        // Draw Circle
        pen.fillStyle = "#86FBCC"
        pen.beginPath()
        pen.arc(x, y, length * 0.0065, 0, 2 * Math.PI)
        pen.fill()
        
        // Play an audio when the circle touches the line
        if(currentTime >= arc.nextImpactTime) {
            // Play audio only if it is enabled
            if(soundEnabled){
                arc.audio.play()
            }
            // Recalculate the next impact time, time = distance / speed
            arc.nextImpactTime =  calculateNextImpactTime(arc.nextImpactTime, arc.velocity)
        }

    })

    requestAnimationFrame(draw)
}


// set the classes initially
toggleAudioStatus()

// Call draw() for the first time
draw()

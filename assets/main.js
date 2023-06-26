
const paper = document.querySelector("#paper")
const pen = paper.getContext("2d")

let startTime = new Date().getTime()
let soundEnabled = false
const maxLoops = 50
const oneFullLoop = 2 * Math.PI
const realignmentTime = 900; // 15 minutes

document.onvisibilitychange = () => soundEnabled = false

paper.onclick = () => soundEnabled = !soundEnabled

const colors = [
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

const calculateNextImpactTime = (currentImpactTime, velocity) => {
    return currentImpactTime + (Math.PI / velocity) * 1000
}

const arcs = colors.map( (color, index) => {
    let audio = new Audio(`assets/audio/key-${index}.wav`)
    audio.volume = 0.02

    const numberOfLoops = oneFullLoop * (maxLoops - index)
    const velocity = numberOfLoops / realignmentTime

    return {
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity
    }
})

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
        x: paper.width *.5,
        y: paper.height *.9
    }

    // Draw the line
    pen.strokeStyle = "white"
    pen.lineWidth = 6

    pen.beginPath()
    pen.moveTo(start.x, start.y)
    pen.lineTo(end.x, end.y)
    pen.stroke()

    const length = end.x - start.x
    const initialArcRadius = length * 0.05
    
    pen.lineWidth = 4

    //const initialArcRadius = length * 0.05
    const spacing = (length / 2 - initialArcRadius) / arcs.length
    
    arcs.forEach( (arc, index) => {
        const maxAngle = 2 * Math.PI
        //const numberOfLoops = oneFullLoop * (maxLoops - index)
        //const velocity = numberOfLoops / realignmentTime
        
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


        const x = center.x + arcRadius * Math.cos(adjustedDistance)
        const y = center.y + arcRadius * Math.sin(adjustedDistance)

        // Draw Circle
        pen.fillStyle = "white"
        pen.beginPath()
        pen.arc(x, y, length * 0.0065, 0, 2 * Math.PI)
        pen.fill()

        
        // Play audio
        if(currentTime >= arc.nextImpactTime) {
            if (index ===10)
                console.log(currentTime + " " + arc.nextImpactTime)
            if(soundEnabled){
                arc.audio.play()
            }
            arc.nextImpactTime =  calculateNextImpactTime(arc.nextImpactTime, arc.velocity)
        }

    })

    requestAnimationFrame(draw)
}

draw()


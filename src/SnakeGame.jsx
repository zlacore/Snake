import { useState, useEffect, useRef } from 'react'
import './snake.css'
function SnakeGame() {
  const gridSize = 26
  const [snake, setSnake] = useState([{ x: 11, y: 13, dir: 'right' }, { x: 12, y: 13, dir: 'right' }, { x: 13, y: 13, dir: 'right' }])
  const [snakeDirection, setSnakeDirection] = useState("right")
  const directionRef = useRef("right")
  const [gameStarted, setGameStarted] = useState(false)
  const [gameText, setGameText] = useState('')
  const [score, setScore] = useState(0)
  const [hungerTimer, setHungerTimer] = useState(100)
  const [scores, setScores] = useState([0])
  const [foodCells, setFoodCells] = useState([])
  const foodRef = useRef(foodCells);
  useEffect(() => { foodRef.current = foodCells }, [foodCells]);
  // const tail = snake[-1]
  function generateGrid(size) {
    const cells = []
    for (let y = 1; y < size; y++) {
      for (let x = 1; x < size; x++) {
        cells.push({ x, y })
      }
    }
    return cells
  }
  const gridCoordinates = generateGrid(gridSize)

  function updateSnake() {
    // const head = snake[0]
    // What do I want it to do?
    // if snake length is more than one:
    // - depending on snake direction, either add or subtract 1 from x or y
    // if any part of snake collides with food:
    // - depending on snake direction, add new snake segment behind tail segment with correct coordinates
    // if snake direction changes:
    // - save coordinate as snake "junction" and appropriately add or subtract one from coordinates
    // if snake collides with self or wall:
    // - set gameStarted to false

    // Order of operations:
    // Check for food
    // Check for junction
    // Add segment to snake
    // Move snake
    //   setSnake((prevSnake) => {
    //     const newSnake = prevSnake
    //     const head = newSnake[1]
    //     head.dir = snakeDirection
    //     console.log(head.dir)
    //     return newSnake
    //   }
    // )
    // Check for food
    // for (const foodCell of foodCells) {
    //   if (head.x === foodCell.x && head.y === foodCell.y)
    //     food = true
    // }

    // Check for junction 
    // for (const junction of junctions) {

    //   setJunctions(prevJunctions => {
    //   // Changes direction of snake segments as they pass through junctions
    //   if (head.x === junction.x && head.y === junction.y) {
    //     head.dir = junction.dir
    //   }

    //   // Removes junctions as the tail of the snake passes through

    //     const newJunctions = [...prevJunctions]
    //     if (tail.x === junction.x && tail.y === junction.y) {
    //       newJunctions.splice(junction, 1)
    //     }
    //     return newJunctions
    //   })
    // }

    // Add segment to snake 
    // if (food === true) {
    //   setScore(score + 1)
    //   // Checks for tail direction and appends new segment to snake array
    //   switch (tail.dir) {
    //     case 'up':
    //       newSnake.push({ x: tail.x, y: tail.y + 1, dir: tail.dir })
    //       break;
    //     case 'down':
    //       newSnake.push({ x: tail.x, y: tail.y - 1, dir: tail.dir })
    //       break;
    //     case 'left':
    //       newSnake.push({ x: tail.x + 1, y: tail.y, dir: tail.dir })
    //       break;
    //     case 'right':
    //       newSnake.push({ x: tail.x - 1, y: tail.y, dir: tail.dir })
    //   }
    // }
    

    // Move snake
    setSnake(prevSnake => {
      const prevPositions = prevSnake.map(segment => ({ x: segment.x, y: segment.y, dir: segment.dir }))
      const newSnake = prevSnake.map((segment, i) => {
        if (i === 0) {
          let { x, y } = segment
          let dir = directionRef.current
          console.log(dir)
          if (dir === 'up') {
            y -= 1
          } else if (dir === 'down') {
            y += 1
          } else if (dir === 'left') {
            x -= 1
          } else if (dir === 'right') {
            x += 1
          }
          return { x, y, dir }
        } else {
          return { ...prevPositions[i - 1] }
        }
      })
      const head = newSnake[0]
      const headlessSnake = newSnake.slice(1)
      const snakeCollision = headlessSnake.some(segment => segment.x === head.x && segment.y === head.y) || head.x > 25 || head.y > 25 || head.x < 1 || head.y < 1
      // Check for Game Over conditions
      if (snakeCollision === true) {
        console.log('Collision!')
        setGameStarted(false)
        setGameText('Game Over! Play again!')
        return prevSnake
      }
      const ateFood = foodRef.current.some(food => head.x === food.x && food.y === head.y)
      console.log(ateFood)
      if (ateFood === true) {
        console.log('Food eaten!')
        setFoodCells(prevFoodCells => prevFoodCells.filter(food => !(food.x === head.x && food.y === head.y)));
        setScore(prevScore => prevScore + 1);
        setHungerTimer(prevHungerTimer => prevHungerTimer + 6)
        const tailPrev = prevPositions[prevPositions.length - 1];
        newSnake.push({ ...tailPrev });
      } else if (ateFood === false) {
        setHungerTimer(prevHungerTimer => prevHungerTimer - 1)
      }
      return newSnake
    }
    )


    // for (let i = 1; i < newSnake.length; i++) {
    //   const segment = newSnake[i]
    //   const head = newSnake[0]
    //   if (head.x === segment.x && head.y === segment.y) {
    //     setGameStarted(false)
    //     setGameText('Game Over! Play again!')
    //   } else if (head.x === 0 || head.y === 0) {
    //     setGameStarted(false)
    //     setGameText('Game Over! Play again!')
    //   } else if (head.x > 25 || head.y > 25) {
    //     setGameStarted(false)
    //     setGameText('Game Over! Play again!')
    //   }
    // }
  }

  function displayGrid() {
    return (
      gridCoordinates.map(cell => {
        let classes = ["cell"]
        if (classes.length === 1)
          classes.push("grass")
        if (foodCells.some(food => food.x === cell.x && food.y === cell.y))
          classes.push("food")
        if (snake.some(segment => segment.x === cell.x && segment.y === cell.y))
          classes.push("snake")
        if (snake.some(segment => segment.x === cell.x && segment.y === cell.y) && foodCells.some(food => food.x === cell.x && food.y === cell.y)) {
          const index = classes.indexOf("food")
          classes.splice(index, 1)
        }

        // console.log(classes)
        // console.log(classes.join(" "))
        return (
          <div
            key={`${cell.x}-${cell.y}`}
            className={classes.join(" ")}
            data-x={cell.x}
            data-y={cell.y}
          >
          </div>
        )
      }
      ))
  }

  function placeFood() {
    setFoodCells(prevFoodCells => {
      const newFoodCells = [...prevFoodCells]
      for (const cell of gridCoordinates) {
        if (prevFoodCells.length > 40) {
          break
        }
        if (Math.random() <= .02) {
          newFoodCells.push({ x: cell.x, y: cell.y })
        }
      }
      return newFoodCells
    })
  }
  // Set event listeners upon starting game
  useEffect(() => {
    if (!gameStarted) return;
    const handleKeyDown = (e) => {
      // const head = snake[0]
      const validKeys = ['w', 'a', 's', 'd']
      const key = e.key.toLowerCase();
      if (!validKeys.includes(key)) return

      // console.log(`Key pressed: ${key}`)

      const opposites = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      }

      let newDirection
      if (key === 'w') newDirection = 'up'
      else if (key === 'a') newDirection = 'left'
      else if (key === 's') newDirection = 'down'
      else if (key === 'd') newDirection = 'right'

      if (opposites[snakeDirection] !== newDirection) {
        setSnakeDirection(newDirection)
        directionRef.current = newDirection
      }

      // head.dir = snakeDirection
      console.log(snakeDirection)
      // setJunctions(prevJunctions => {
      //   const newJunctions = [...prevJunctions]
      //   switch (head.dir) {
      //     case 'up':
      //       newJunctions.push({ x: head.x, y: head.y - 1, dir: snakeDirection })
      //       break
      //     case 'down':
      //       newJunctions.push({ x: head.x, y: head.y + 1, dir: snakeDirection })
      //       break
      //     case 'left':
      //       newJunctions.push({ x: head.x - 1, y: head.y, dir: snakeDirection })
      //       break
      //     case 'right':
      //       newJunctions.push({ x: head.x + 1, y: head.y, dir: snakeDirection })
      //   }
      //   return newJunctions
      // })
      // Push new junction in front of snake head to change direction upon re-render
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gameStarted, snakeDirection])

  useEffect(() => {
    if (!gameStarted) return;
    const interval = setInterval(() => {
      console.log('interval executed!')
      placeFood()
      updateSnake()
      // displayGrid()


      // if (score > 40) {
      //   setGameSpeed(200)

      // } else if (score > 80) {
      //   setGameSpeed(150)
      // } else if (score > 100) {
      //   setGameSpeed(100)
      // } else if (score > 200) {
      //   setGameSpeed(75)
      // }
      // speedRef.current = gameSpeed
    }, 100)
    
    return () => clearInterval(interval)
  }, [gameStarted])
  
  
  function startGame() {
    setSnake([
      { x: 13, y: 13, dir: 'right' },
      { x: 12, y: 13, dir: 'right' }, 
      { x: 11, y: 13, dir: 'right' }, 
    ])
    console.log(snake)
    setSnakeDirection("right")
    directionRef.current = "right"
    setScore(0)
    setHungerTimer(100)
    setFoodCells([])
    setGameStarted(true)
    console.log('Game Started!')
    setGameText('')

    // Loop through and every gridSize interval, increment y value by 1

  }
  useEffect(() => {
  if (hungerTimer < 0 && gameStarted) {
    setGameStarted(false)
    setGameText('Game Over! Play again!')
  }
}, [hungerTimer, gameStarted])
  return (
    <>
      {!gameStarted &&
        <button onClick={() => {
          startGame()
        }}>
          Start Game!
        </button>
      }
      <h1>{gameText}</h1>
       <h1>{`Score: ${score}`}</h1>
      {
        gameStarted &&
        <div id='gameboard'>
          {
            displayGrid()
          }
          <h1>{`Food: ${hungerTimer}`}</h1>
          {/* <h1>{`Score: ${score}`}</h1> */}
        </div>
      }
    </>
  )
}

export default SnakeGame

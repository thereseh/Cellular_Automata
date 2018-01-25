! function () {
    'use strict'
    let currentGrid = []
    let nextGrid = []
    let i_gridSize = 100


    const app = {
        canvas: null,
        ctx: null,

        init() {
            this.canvas = document.getElementsByTagName('canvas')[0]
            this.ctx = this.canvas.getContext('2d')
            this.draw = this.draw.bind(this)
            this.fullScreenCanvas()

            window.onresize = this.fullScreenCanvas.bind(this)

            requestAnimationFrame(this.draw)

            for (let i = 0; i < i_gridSize; i++) {
                currentGrid[i] = []
                nextGrid[i] = []

                for (let j = 0; j < i_gridSize; j++) {

                    let cell = {
                        state: 0,
                        deaths: 0,
                        zombie: false,
                    }

                    let cell2 = {
                        state: 0,
                        deaths: 0,
                        zombie: false,
                    }

                    cell.state = Math.random() > .5 ? 1 : 0

                    currentGrid[i][j] = cell
                    nextGrid[i][j] = cell2
                }

            }

        },


        fullScreenCanvas() {
            this.canvas.width = this.height = window.innerWidth
            this.canvas.height = this.width = window.innerHeight
        },

        countNeighbors(grid, x, y) {
            let n_sum = 0
            let n_sum_zombies = 0

            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {

                    let col = (x + i + i_gridSize) % i_gridSize
                    let row = (y + j + i_gridSize) % i_gridSize

                    n_sum += grid[col][row].state

                    if (grid[col][row].zombie) {
                        n_sum_zombies++;
                    }

                }
            }

            if (grid[x][y].zombie) {
                n_sum_zombies--
            }

            n_sum -= grid[x][y].state

            return [n_sum, n_sum_zombies]
        },

        // update simulation
        animate() {

            for (let i = 0; i < i_gridSize; i++) {
                for (let j = 0; j < i_gridSize; j++) {
                    // get current state of cell
                    let b_cell_state = currentGrid[i][j].state;

                    let n_neighbors_alive = this.countNeighbors(currentGrid, i, j)



                    // MY CHANGES, THE WALKING DEAD
                    // Added a zombie state to the cell
                    // New conditions is that, if the cell have died more than 4 times,
                    // or if the cell (alive) have 1 or more zombie neighbors, then it becomes a zombie.
                    //
                    // I played around with different numbers, the current set is what seem to keep the war on brains going at an interesting pace.
                    //
                    // The red cells are zombies
                    //
                    // To be honest, I'm kind of disappointed, I was excepting the result to be a little bit more epic.
                    // The lifespan is a lot shorter than the normal Game of Life, and it's a little bit more chaos going on, which is cool, with clicks of zombies
                    // traveling around the screen eating brains (they seem to need to exist in group). It kind of gives the look of a virus or something destroying cells 
                    // (is prob too because of the two different colors)
                    // the end result is small clicks of survivers. I'm also getting this pretty flower looking shape
                    // (the Tub cell) that has 4 zombies and a dead guy in the middle
                    //
                    // Let's just say that the reminder of the surviving cells are superior 


                    // if the cell is alive and have more 1 or zombie neighbors
                    if (b_cell_state === 1 && n_neighbors_alive[1] >= 1) {
                        // then the cell die, and becomes a zombie
                        nextGrid[i][j].zombie = true
                    }

                    // if the cell is a zombie, and have 7 zombie neighbors
                    // then the zombie will starve and die
                    if (nextGrid[i][j].zombie = true && n_neighbors_alive[1] === 7) {
                        // no longer a zombie
                        nextGrid[i][j].state = 0
                        nextGrid[i][j].zombie = false
                    }

                    // if the cell isn't a zombie, it's dead and is reborn because of 3 neighbors
                    if (!nextGrid[i][j].zombie && b_cell_state === 0 && n_neighbors_alive[0] === 3) {
                        // alive
                        nextGrid[i][j].state = 1

                        // if the cell have died and been reborn more than 4 times, then it becomes a zombie
                        if (nextGrid[i][j].deaths > 4) {
                            nextGrid[i][j].zombie = true
                        }
                    } else if (b_cell_state === 1 && (n_neighbors_alive[0] < 2 || n_neighbors_alive[0] > 3)) {
                        nextGrid[i][j].state = 0
                            // if the cell dies of natural causes, add to deaths
                        nextGrid[i][j].deaths = nextGrid[i][j].deaths + 1
                    } else {
                        nextGrid[i][j].state = b_cell_state
                    }
                }
            }

            let swap = currentGrid
            currentGrid = nextGrid
            nextGrid = swap


            //debugger
            //use game of life to determine if cell should live or die
            // set new cell value in nextGrid based on results
            //
            // assign values in nextGrid to currentGrid
        },

        draw() {
            requestAnimationFrame(this.draw)
            this.animate()

            // draw to your canvas here
            let canWidth = 600
            let canHeight = 600

            this.ctx.fillStyle = 'white'
            this.ctx.fillRect(0, 0, 600, 600)

            let cellWidth = canWidth / i_gridSize
            let cellHeight = canHeight / i_gridSize

            for (let i = 0; i < i_gridSize; i++) {
                for (let j = 0; j < i_gridSize; j++) {
                    let yPos = i * cellHeight
                    let xPos = j * cellWidth


                    if (currentGrid[i][j].state === 1) {
                        
                        // print different colors
                        if (currentGrid[i][j].zombie) {
                            this.ctx.fillStyle = "red"
                        } else {
                            this.ctx.fillStyle = "green"
                        }
                        this.ctx.fillRect(xPos, yPos, cellWidth - 1, cellHeight - 1)
                    }
                }
            }
        },
    }

    window.onload = app.init.bind(app)

}()

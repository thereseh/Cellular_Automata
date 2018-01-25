!function() {
  'use strict'
  let currentGrid =[]
  let nextGrid = []
  let i_gridSize = 100
  
  
  const app = {
    canvas: null,
    ctx: null,
      
    init() {
      this.canvas = document.getElementsByTagName('canvas')[0]
      this.ctx = this.canvas.getContext( '2d' )
      this.draw = this.draw.bind( this )
      this.fullScreenCanvas()
      
      window.onresize = this.fullScreenCanvas.bind( this )  
      
      requestAnimationFrame( this.draw )
      
      for( let i = 0; i < i_gridSize; i++ ) {
        currentGrid[i] = []
        nextGrid[i] = []
        
        for ( let j = 0; j < i_gridSize; j++ ) {
          currentGrid[i][j] = Math.random() >.5 ? 1 : 0
          nextGrid[i][j] = 0
        }
        
      }
      
    },
    
    
    fullScreenCanvas() {
      this.canvas.width  = this.height = window.innerWidth
      this.canvas.height = this.width = window.innerHeight
    },
    
    countNeighbors(grid, x, y) {
      let sum = 0
      
        for ( let i = -1; i < 2; i++) {
          for ( let j = -1; j < 2; j++) {
            
            let col = (x + i + i_gridSize) % i_gridSize
            let row = (y + j + i_gridSize) % i_gridSize
            
            sum += grid[col][row]
            
            
          }
        }
      
      sum -= grid[x][y]
      
      return sum
    },
    
    // update simulation
    animate() {
      
      for ( let i = 0; i < i_gridSize; i++ ) {        
        for ( let j = 0; j < i_gridSize; j++ ) {
          // get current state of cell
          let b_cell_state = currentGrid[i][j];

          let n_neighbors_alive = this.countNeighbors(currentGrid, i, j)
          if ( b_cell_state === 0 && n_neighbors_alive === 3 ) {
            nextGrid[i][j] = 1
          } else if ( b_cell_state === 1 && ( n_neighbors_alive < 2 || n_neighbors_alive > 3 ) ) {
            nextGrid[i][j] = 0
          } else {
            nextGrid[i][j] = b_cell_state
          }
        } 
      }
      
      let swap = currentGrid
      currentGrid = nextGrid
      nextGrid = swap

    },
    
    draw() {
      requestAnimationFrame( this.draw )
      this.animate()
      
      // draw to your canvas here
      let canWidth = 600
      let canHeight = 600
      
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect( 0, 0, 600, 600 )
      
      let cellWidth = canWidth / i_gridSize
      let cellHeight = canHeight / i_gridSize
      
      for ( let i = 0; i < i_gridSize; i++ ) {
        for ( let j = 0; j < i_gridSize; j++ ) {
          let yPos = i * cellHeight
          let xPos = j * cellWidth

          if (currentGrid[i][j] === 1 ) {
            this.ctx.fillStyle = "#ff6600"
            this.ctx.fillRect( xPos, yPos, cellWidth-1, cellHeight-1 )
          }
        } 
      }
    },
  }
  
  window.onload = app.init.bind( app )
  
}()
// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

  @8192 // Number of 16-bit arrays in a screen
  D=A
  @n
  M=D
  @i    // Variable for the loop
  M=0

(WAIT_FOR_KEY)
  @i
  M=0
  @KBD
  D=M
  @FILL   // Jump to Fill if key is pressed
  D;JGT

  @MAKE_WHITE
  0;JMP

(MAKE_WHITE)
  @i    // if i == n then jump to WAIT_FOR_KEY
  D=M
  @n
  D=M-D
  @WAIT_FOR_KEY
  D;JEQ

  @SCREEN
  D=A
  @i
  A=D+M // RAM[SCREEN + i] = 0
  M=0
  @i
  M=M+1 // i++
  @MAKE_WHITE
  0;JMP


(FILL)
  @i    // if i == n then jump to end
  D=M
  @n
  D=M-D
  @WAIT_FOR_KEY
  D;JEQ

  @SCREEN
  D=A
  @i
  A=D+M // RAM[SCREEN + i] = -1
  M=-1
  @i
  M=M+1 // i++
  @FILL
  0;JMP

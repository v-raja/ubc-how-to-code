// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

  @R0  // n = R0
  D=M
  @n
  M=D

  @0
  D=A
  @i  // i = 0
  M=D

  @R1 // mult = R1
  D=M
  @mult
  M=D

  @R2 // R2 = 0
  M=0

(LOOP)
  @i    // if i == n jump to END
  D=M
  @n
  D=D-M
  @END
  D;JEQ

  @mult
  D=M
  @R2
  M=M+D   // R2 += mult
  @i      // i++
  M=M+1
  @LOOP
  0;JMP

(END)
  @END
  0;JMP

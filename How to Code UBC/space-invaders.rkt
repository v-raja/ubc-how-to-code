;; The first three lines of this file were inserted by DrRacket. They record metadata
;; about the language level of this file in a form that our tools can easily process.
#reader(lib "htdp-beginner-reader.ss" "lang")((modname space-invaders-starter) (read-case-sensitive #t) (teachpacks ()) (htdp-settings #(#t constructor repeating-decimal #f #t none #f () #f)))
(require 2htdp/universe)
(require 2htdp/image)

;; Space Invaders


;; Constants:

(define WIDTH  300)
(define HEIGHT 500)

(define INVADER-X-SPEED 1.5)  ;speeds (not velocities) in pixels per tick
(define INVADER-Y-SPEED 1.5)
(define INVADER-GRADIENT (/ INVADER-Y-SPEED INVADER-X-SPEED))
(define TANK-SPEED 2)
(define MISSILE-SPEED 10)

(define HIT-RANGE 10)

(define INVADE-RATE 1) ; [0, 100] with 100 being new invader per tick

(define BACKGROUND (empty-scene WIDTH HEIGHT))

(define INVADER
  (overlay/xy (ellipse 10 15 "outline" "blue")              ;cockpit cover
              -5 6
              (ellipse 20 10 "solid"   "blue")))            ;saucer

(define TANK
  (overlay/xy (overlay (ellipse 28 8 "solid" "black")       ;tread center
                       (ellipse 30 10 "solid" "green"))     ;tread outline
              5 -14
              (above (rectangle 5 10 "solid" "black")       ;gun
                     (rectangle 20 10 "solid" "black"))))   ;main body

(define TANK-HEIGHT/2 (/ (image-height TANK) 2))

(define MISSILE (ellipse 5 15 "solid" "red"))

(define TANK-LINE (- HEIGHT TANK-HEIGHT/2))




;; Data Definitions:

(define-struct game (invaders missiles tank))
;; Game is (make-game  (listof Invader) (listof Missile) Tank)
;; interp. the current state of a space invaders game
;;         with the current invaders, missiles and tank position

;; Game constants defined below Missile data definition

#;
(define (fn-for-game g)
  (... (fn-for-loinvader (game-invaders g))
       (fn-for-lom (game-missiles g))
       (fn-for-tank (game-tank g))))



(define-struct tank (x dir))
;; Tank is (make-tank Number Integer[-1, 1])
;; interp. the tank location is x, HEIGHT - TANK-HEIGHT/2 in screen coordinates
;;         the tank moves TANK-SPEED pixels per clock tick left if dir -1, right if dir 1

(define T0 (make-tank (/ WIDTH 2) 1))   ;center going right
(define T1 (make-tank 50 1))            ;going right
(define T2 (make-tank 50 -1))           ;going left

#;
(define (fn-for-tank t)
  (... (tank-x t) (tank-dir t)))



(define-struct invader (x y dx))
;; Invader is (make-invader Number Number Number)
;; interp. the invader is at (x, y) in screen coordinates
;;         the invader along x by dx pixels per clock tick

(define I1 (make-invader 150 100 12))           ;not landed, moving right
(define I2 (make-invader 150 HEIGHT -10))       ;exactly landed, moving left
(define I3 (make-invader 150 (+ HEIGHT 10) 10)) ;> landed, moving right


#;
(define (fn-for-invader invader)
  (... (invader-x invader) (invader-y invader) (invader-dx invader)))


(define-struct missile (x y))
;; Missile is (make-missile Number Number)
;; interp. the missile's location is x y in screen coordinates

(define M1 (make-missile 150 300))                               ;not hit U1
(define M2 (make-missile (invader-x I1) (+ (invader-y I1) 10)))  ;exactly hit U1
(define M3 (make-missile (invader-x I1) (+ (invader-y I1)  5)))  ;> hit U1

#;
(define (fn-for-missile m)
  (... (missile-x m) (missile-y m)))



(define G0 (make-game empty empty T0))
(define G1 (make-game empty empty T1))
(define G2 (make-game (list I1) (list M1) T1))
(define G3 (make-game (list I1 I2) (list M1 M2) T1))

;; List of Missile is one of:
;; -empty
;; cons Missile ListOfMissile
;; interp. List of missiles currently on the screen

(define LOM1 empty)                              ; no missile on screen
(define LOM2 (cons M1 empty))                    ; one missile on screen
(define LOM3 (cons (make-missile 160 200) LOM2)) ; two missiles on screen

#;
(define (fn-for-lom lom)
  (cond [(empty? lom) (...)]
        [else (... (fn-for-missile (first lom))
                   (fn-for-lom (rest lom)))]))

;; List of Invader is one of:
;; - empty
;; - cons Invader ListOfInvader
;; interp. list of invaders currently on the screen

(define LOI1 empty)                     ; no invader on screeen
(define LOI2 (cons I1 (cons I2 empty))) ; two invaders

#;
(define (fn-for-loinvader loi)
  (cond [(empty? loi) (...)]
        [else (... (fn-for-invader (first loi))
                   (fn-for-loinvader (rest loi)))]))

;  ================================================================
;; Functions:

(define START (make-game empty empty (make-tank (/ WIDTH 2) 1))) 
;; Game -> Game
;; start the world with initial state game, for example: (main START)
(define (main game)
  (big-bang game                         ; Game
    (on-tick   advance-game)             ; Game -> Game
    (to-draw   render)                   ; Game -> Image
    (stop-when any-invader-landed?)       ; Game -> Boolean
    (on-key    control-tank)))           ; Game KeyEvent -> Game))    



;  ================================================================
;; advance-game and it's helper functions to change the game state:


;; Game -> Game
;; Advances invaders and creates new invaders by calling advance-invaders with INVADE-RATE
;; Advances missiles by calling advance-missiles
;; Advances tank by calling advance-tank
;; Removes collided invaders and missiles by calling remove-collided 
; (define (advance-game g) G0)  ;stub
(define (advance-game g)
  (remove-collided (make-game (advance-invaders (game-invaders g) INVADE-RATE)
                              (advance-missiles (game-missiles g))
                              (advance-tank (game-tank g)))))


;; ListOfInvaders Number -> ListOfInvaders
;; Advances invaders by calling advance-invader for each invader
;; Adds invader by calling create-invader with INVADE-RATE
(check-expect (advance-invaders empty 0) empty)                                                                              ; base case
(check-expect (advance-invaders (cons I1 (cons I2 empty)) 0) (cons (advance-invader I1) (cons (advance-invader I2) empty)))  ; list with two or more items
;(define (advance-invaders loi) loi) ; stub
(define (advance-invaders loi rate)
  (cond [(empty? loi) (create-invader rate)]
        [else (cons (advance-invader (first loi))
                    (advance-invaders (rest loi) rate))]))


;; Invader -> Invader
;; Advances invader by dy and dx. Bounces off the left and right sides of screen and changes direction after bouncing.
;; Calls next-x-invader and next-y-invader to calculate next x and y positions of invader
(check-expect (advance-invader I1) (make-invader (+ 150 12) (+ 100 (* (/ INVADER-Y-SPEED INVADER-X-SPEED) 12)) 12))                             ; advance an invader right
(check-expect (advance-invader (make-invader WIDTH 60 -10)) (make-invader (+ WIDTH -10) (next-y-invader (make-invader WIDTH 60 -10)) -10))      ; advance an invader left
(check-expect (advance-invader (make-invader (- WIDTH 2) 100 10)) (make-invader WIDTH (next-y-invader (make-invader (- WIDTH 2) 100 10)) -10))  ; just before right edge
(check-expect (advance-invader (make-invader (+ 0 3) 50 -10)) (make-invader 0 (next-y-invader (make-invader (+ 0 3) 50 -10)) 10))               ; just before left edge
(check-expect (advance-invader (make-invader WIDTH 75 10)) (make-invader WIDTH (next-y-invader (make-invader WIDTH 75 10)) -10))                ; at right edge
(check-expect (advance-invader (make-invader 0 60 -10)) (make-invader 0 (next-y-invader (make-invader 0 60 -10)) 10))                           ; at left edge
;(define (advance-invader I1) I1) ; stub
(define (advance-invader i)
  (cond [(>= (next-x-invader i) WIDTH)
         (make-invader WIDTH (next-y-invader i) (- (invader-dx i)))]
        [(<= (next-x-invader i) 0)
         (make-invader 0 (next-y-invader i) (- (invader-dx i)))]
        [else (make-invader (next-x-invader i) (next-y-invader i) (invader-dx i))]))


;; Invader -> Number
;; Calculates an invader's next y-position by adding dy to y. NOTE: dy is calcualted by multiplying the INVADER-GRADIENT (dy/dx) with dx.
(check-expect (next-y-invader (make-invader 10 100 10)) (+ 100 (* INVADER-GRADIENT 10))) ; invader moving right
(check-expect (next-y-invader (make-invader 20 50 -10)) (+ 50 (* INVADER-GRADIENT 10)))  ; invader moving left
;(define (next-y-invader i) 0) ; stub
(define (next-y-invader i)
  (+ (invader-y i) (* INVADER-GRADIENT (abs (invader-dx i)))))


;; Invader -> Number
;; Calculates an invader's next x-position by adding dx to x
(check-expect (next-x-invader (make-invader 1 0 50)) (+ 1 50))         ; invader moving right
(check-expect (next-x-invader (make-invader 100 0 -25)) (+ 100 -25))   ; invader moving left
; (define (next-x-invader i) 0) ; stub
(define (next-x-invader i)
  (+ (invader-x i) (invader-dx i)))


;; ListOfInvader -> ListOfInvader
;; Returns a new list of invaders with an additional invader added at INVADE-RATE intervals
;; Calls random-direction to get direction of new invader
;; NOTE: Can't test this function because (random WIDTH) and (random-direction 1) yields different results on each call
;(define (create-invaders loi) loi) ; stub
(define (create-invader rate)
  (cond[(< (random 100) rate)
        (cons (make-invader (random WIDTH) 0 (random-direction 1)) empty)]
       [else empty]))


;; Number -> Number
;; Given a number, return the negative or positive value of the integer randomly
;; NOTE: Can't test because of randomness
;(define (random-direction i) i) ; stub
(define (random-direction i)
  (if (= (modulo (random 10) 2) 1)
      (- i)
      i))


;; ListOfMissiles -> ListOfMissiles
;; Advances missile to next position by calling advance-missile for each missile. 
;; If offscreen-missile? then remove missile
(check-expect (advance-missiles empty) empty)                                                                                                                    ; base case
(check-expect (advance-missiles (cons (make-missile 150 0) (cons M1 empty))) (cons (advance-missile M1) empty))                                                  ; check if remove off-screen missile at beginning of list
(check-expect (advance-missiles (cons M2 (cons M1 (cons (make-missile 150 0) empty)))) (cons (advance-missile M2) (cons (advance-missile M1) empty)))            ; check if remove off-screen missile three-deep in list
(check-expect (advance-missiles (cons (make-missile 250 100) (cons M1 empty))) (cons (advance-missile (make-missile 250 100)) (cons(advance-missile M1) empty))) ; check if advances missiles at beginning and two-deep in list
(check-expect (advance-missiles (cons (make-missile 100 0) (cons (make-missile 200 0) empty))) empty)                                                            ; check if remove all instances of off-screen missiles
;(define (advance-missiles lom) lom) ; stub
(define (advance-missiles lom)
  (cond [(empty? lom) empty]
        [else (if (offscreen-missile? (advance-missile (first lom)))
                  (advance-missiles (rest lom))
                  (cons (advance-missile (first lom)) (advance-missiles (rest lom))))]))


;; Missile -> Missile
;; Advances missile y coordinate by MISSILE-SPEED
(check-expect (advance-missile (make-missile 150 300)) (make-missile 150 (- 300 MISSILE-SPEED))) ; missile in middle of the screen
(check-expect (advance-missile (make-missile 150 0)) (make-missile 150 (- 0 MISSILE-SPEED)))     ; missile at top of screen
;(define (advance-missile m) m) ; stub
(define (advance-missile m)
  (make-missile (missile-x m) (- (missile-y m) MISSILE-SPEED)))


;; Missile -> Boolean
;; Returns true if y-position of missile < 0 (i.e. off-screen)
(check-expect (offscreen-missile? (make-missile 10 0)) false)   ; missile on top edge
(check-expect (offscreen-missile? (make-missile 20 -10)) true)  ; missile past top edge
(check-expect (offscreen-missile? (make-missile 30 100)) false) ; missile in screen
; (define (remove-missile? m) true) ; stub
(define (offscreen-missile? m)
  (> 0 (missile-y m)))


;; Tank -> Tank
;; Advances tank to next position by adding(dir == 1) or subtracting(dir == -1) TANK-SPEED. Bounces tanks off the side and changes direction.
;; Calls next-x-tank for tank's next x coordinate
(check-expect (advance-tank (make-tank 100 1)) (make-tank (+ 100 TANK-SPEED) 1))   ; advances tank going right
(check-expect (advance-tank (make-tank 200 -1)) (make-tank (- 200 TANK-SPEED) -1)) ; advances tank going left
(check-expect (advance-tank (make-tank (- WIDTH 1) 1)) (make-tank WIDTH -1))       ; just before right edge ; changes direction
(check-expect (advance-tank (make-tank WIDTH 1)) (make-tank WIDTH -1))             ; at right edge going right ; changes direction
(check-expect (advance-tank (make-tank (+ 0 1) -1)) (make-tank 0 1))               ; just before left edge ; changes direction
(check-expect (advance-tank (make-tank 0 -1)) (make-tank 0 1))                     ; at left edge going left ; changes direction
;(define (advance-tank t) t) ; stub
(define (advance-tank t)
  (cond [(<= (next-x-tank t) 0)
         (make-tank 0 (- (tank-dir t)))]
        [(>= (next-x-tank t) WIDTH)
         (make-tank WIDTH (- (tank-dir t)))]
        [else (make-tank (next-x-tank t) (tank-dir t))]))


;; Tank -> Number
;; Given a tank, returns a tank's next x coordinate
(check-expect (next-x-tank (make-tank 300 1)) (+ 300 TANK-SPEED))  ; tank going right
(check-expect (next-x-tank (make-tank 100 -1)) (- 100 TANK-SPEED)) ; tank going left
;(define (next-x-tank t) 0) ; stub
(define (next-x-tank t)
  (+ (tank-x t) (* TANK-SPEED (tank-dir t))))
  

;; Game -> Game 
;; Calls remove-collided-invader to remove collided invaders and remove-collided-missile to remove collided missiles
(check-expect (remove-collided (make-game empty empty T1)) (make-game empty empty T1))                                             ; base case: empty invader and missile lists
(check-expect (remove-collided (make-game (cons I1 empty) empty T1)) (make-game (cons I1 empty) empty T1))                         ; base case: empty missile list
(check-expect (remove-collided (make-game empty (cons M1 empty) T1)) (make-game empty (cons M1 empty) T1))                         ; base case: empty invader list
(check-expect (remove-collided (make-game (cons I2 (cons I1 (cons I3 empty)))
                                          (cons (make-missile (invader-x I1) (+ (invader-y I1) HIT-RANGE))
                                                (cons (make-missile (invader-x I2) (+ (invader-y I2) HIT-RANGE))
                                                      (cons (make-missile (invader-x I3) (+ (invader-y I3) HIT-RANGE)) empty)))
                                          T1))
              (make-game empty empty T1))                                                                                           ; removes all instances of collided invaders and missiles
(check-expect (remove-collided (make-game (cons I1 (cons I2 empty))
                                          (cons (make-missile 0 0)
                                                (cons (make-missile (invader-x I2) (+ (invader-y I2) 5)) empty))
                                          T2))
              (make-game (cons I1 empty) (cons (make-missile 0 0) empty) T2))                                                       ; removes collided invader and collided missile two deep in list
;(define (remove-collided G0) G0) ; stub
(define (remove-collided g)
  (make-game 
   (remove-collided-invader (game-invaders g) (game-missiles g))
   (remove-collided-missile (game-missiles g) (game-invaders g))
   (game-tank g)))


;; ListOfInvader ListOfMissile -> ListOfInvader
;; Calls each invader in ListOfInvader with (collided-invader? Invader ListOfMissile)
;; If collided-invader? then remove invader from list
(check-expect (remove-collided-invader empty (cons M1 empty)) empty)                                               ; base case: empty invader list
(check-expect (remove-collided-invader (cons I1 empty) empty) (cons I1 empty))                                     ; base case: empty missile list
(check-expect (remove-collided-invader (cons I1 (cons I2 empty))
                                       (cons (make-missile 0 0) (cons (make-missile (invader-x I2) (+ (invader-y I2) 5)) empty)))
              (cons I1 empty))                                                                                     ; removes collided invaders two-deep in list
(check-expect (remove-collided-invader (cons I1 empty)
                                       (cons (make-missile 0 0) (cons (make-missile (invader-x I1) (+ (invader-y I1) 5)) empty)))
              empty)                                                                                               ; removes invader when missile is two-deep in list
(check-expect (remove-collided-invader (cons I2 empty)
                                       (cons (make-missile 0 0) (cons (make-missile (invader-x I1) (+ (invader-y I1) 5)) empty)))
              (cons I2 empty))                                                                                     ; keeps invader if not collided
(check-expect (remove-collided-invader (cons I1 (cons I2 empty))
                                       (cons (make-missile (invader-x I2) (invader-y I2)) (cons (make-missile (invader-x I1) (+ (invader-y I1) 5)) empty)))
              empty)                                                                                               ; removes more than one instance of collided invader
;(define (remove-collided-invader loi lom) loi) ; stub
(define (remove-collided-invader loi lom)
  (cond [(empty? loi) empty]
        [else (if (collided-invader? (first loi) lom)
                  (remove-collided-invader (rest loi) lom)
                  (cons (first loi) (remove-collided-invader (rest loi) lom)))]))


;; Invader ListOfMissile -> Boolean
;; Calls hit? with invader and each missle in ListOfMissile. If an invader collides with one missile, returns true.
(check-expect (collided-invader? I1 empty) false)                                                                                                                   ; base case
(check-expect (collided-invader? I1 (cons (make-missile 0 0) (cons (make-missile (invader-x I2) (+ (invader-y I2) 5)) empty))) false)                               ; returns false if no collisions   
(check-expect (collided-invader? I2 (cons (make-missile 0 0) (cons (make-missile 20 100 ) (cons (make-missile (invader-x I2) (+ (invader-y I2) 5)) empty)))) true)  ; returns true if collides with missile three-deep in list
;(define (collided-invader? i) true) ; stub
(define (collided-invader? i lom)
  (cond [(empty? lom) false]
        [else (if (hit? i (first lom))
                  true
                  (collided-invader? i (rest lom)))]))


;; Invader Missile -> Boolean
;; Returns true if missile is in a HIT-RANGE radius of the invader (i.e. invader and missile are within HIT-RANGE distance of each other vertically and horizontally)
;; NOTE: vertical distance between invader and missile is bounded from 0 to 10 because missile cannot hit an invader from above (missile is moving up as invader is moving down)
(check-expect (hit? (make-invader 50 100 10) (make-missile 50 110)) true)   ; missile just hits invader
(check-expect (hit? (make-invader 60 100 10) (make-missile 60 100)) true)   ; missile at invader
(check-expect (hit? (make-invader 90 100 10) (make-missile 90 99 )) false)  ; missile just after invader
(check-expect (hit? (make-invader 51 100 10) (make-missile 50 100 )) true)  ; different x-coordinates
; (define (hit? i m) false)
(define (hit? i m)
  (and (< (abs (- (invader-x i) (missile-x m))) HIT-RANGE)
       (>= (- (missile-y m) (invader-y i)) 0)
       (<= (- (missile-y m) (invader-y i)) HIT-RANGE)))


;; ListOfMissile ListOfInvader -> ListOfMissile
;; Calls each missile in ListOfMissile with (collided-missile? Missile ListOfInvader)
;; If collided-missile? then remove missile from list
(check-expect (remove-collided-missile empty (cons I1 empty)) empty)                    ; base case: empty missile list
(check-expect (remove-collided-missile (cons M1 empty) empty) (cons M1 empty))          ; base case: empty invader list
(check-expect (remove-collided-missile (cons (make-missile 0 0) (cons (make-missile (invader-x I2) (+ (invader-y I2) 5)) empty))
                                       (cons I1 (cons I2 empty)))
              (cons (make-missile 0 0) empty))                                          ; removes collided missile two-deep in list
(check-expect (remove-collided-missile (cons (make-missile 0 0) (cons (make-missile (invader-x I1) (+ (invader-y I1) 5)) empty))
                                       (cons I1 (cons (make-invader 0 0 0) empty)))
              empty)                                                                    ; removes more than one instace of collided missiles
;(define (remove-collided-missile lom loi) lom) ; stub
(define (remove-collided-missile lom loi)
  (cond [(empty? lom) empty]
        [else (if (collided-missile? (first lom) loi)
                  (remove-collided-missile (rest lom) loi)
                  (cons (first lom) (remove-collided-missile (rest lom) loi)))]))


;; Missile ListOfInvaders -> Boolean
;; Calls hit? with missile and each invader in ListOfInvaders. If a missile collides with one invader, returns true.
(check-expect (collided-missile? M1 empty) false)                                                                               ; base case
(check-expect (collided-missile? (make-missile (invader-x I2) (+ (invader-y I2) 5))  (cons I1 (cons I3 (cons I2 empty)))) true) ; returns true if collides with invader three-deep in list
(check-expect (collided-missile? (make-missile 0 0) (cons I2 (cons I1 empty))) false)                                           ; returns false if no collisions
;(define (collided-missile? m loi) true) ; stub
(define (collided-missile? m loi)
  (cond [(empty? loi) false]
        [else (if (hit? (first loi) m)
                  true
                  (collided-missile? m (rest loi)))]))


;  ================================================================
;; render and it's helper functions to render images based on game state

;; Game -> Image
;; Produce image with missiles, invaders, and tank placed on BACKGROUND at their x, y positions
;; Calls place-tank to create a base image of the tank on BACKGROUND
;; Calls place-missiles on the image returned by place-tank
;; Calls place-invaders on image returned by place-missiles
;; No tests as each function is tested individually
;(define (render g) BACKGROUND) ; stub
(define (render g)
  (place-invaders (game-invaders g)
                  (place-missiles (game-missiles g)
                                  (place-tank (game-tank g)))))


;; Tank -> Image
;; Places tank on BACKGROUND at tank's x coordiante and y-coordinate of TANK-LINE
(check-expect (place-tank (make-tank (/ WIDTH 2) 1)) (place-image TANK (/ WIDTH 2) TANK-LINE BACKGROUND)) ; TANK on BACKGROUND
;(define (place-tank t) BACKGROUND) ; stub
(define (place-tank t)
  (place-image TANK (tank-x t) TANK-LINE BACKGROUND))


;; ListOfMissile Image -> Image
;; Given an image, places missiles in ListOfMissile on image by calling place-missile for each missile in list
(check-expect (place-missiles empty BACKGROUND) BACKGROUND)                                                                                        ; base case
(check-expect (place-missiles (cons M1 (cons M2 (cons M3 empty))) BACKGROUND) (place-missile M1 (place-missile M2 (place-missile M3 BACKGROUND)))) ; testing recursion on three-deep list
;(define (place-missiles lom i) i) ; stub
(define (place-missiles lom i)
  (cond [(empty? lom) i]
        [else (place-missile (first lom)
                             (place-missiles (rest lom) i))]))


;; Missile Image -> Image
;; Given an image, places missile on image at missile's coordinates
(check-expect (place-missile M1 (place-invader I1 BACKGROUND)) (place-image MISSILE (missile-x M1) (missile-y M1) (place-invader I1 BACKGROUND))) ; MISSILE on BACKGROUND
;(define (place-missile m i) i) ; stub
(define (place-missile m i)
  (place-image MISSILE (missile-x m) (missile-y m) i))


;; ListOfInvader Image -> Image
;; Given an image, places invaders in ListOfInvader on image by calling place-invader for each invader in list
(check-expect (place-invaders empty BACKGROUND) BACKGROUND)                                                                                        ; base case
(check-expect (place-invaders (cons I1 (cons I2 (cons I3 empty))) BACKGROUND) (place-invader I1 (place-invader I2 (place-invader I3 BACKGROUND)))) ; testing recursion on three-deep list
;(define (place-invaders loi i) i) ; stub
(define (place-invaders loi i)
  (cond [(empty? loi) i]
        [else (place-invader (first loi)
                             (place-invaders (rest loi) i))]))


;; Invader Image -> Image
;; Given an image, places invader on image at invader's coordinates
(check-expect (place-invader I1 BACKGROUND) (place-image INVADER (invader-x I1) (invader-y I1) BACKGROUND)) ; INVADE on BACKGROUND
; (define (place-invader invader i) i) ; stub
(define (place-invader invader i)
  (place-image INVADER (invader-x invader) (invader-y invader) i))


;  ================================================================
;; any-invader-landed? and it's helper functions to check if invader has landed

;; Game -> Boolean
;; Gets list of invaders from a game instance and calls invader-landed? with list
; (define (any-invader-landed? g) false) ; stub
(define (any-invader-landed? s)
  (invader-landed? (game-invaders s)))


;; ListOfInvader -> Boolean
;; calls invader-landed2? for every invader in list and returns true if any invader in list has landed
(check-expect (invader-landed? empty) false)                                                                             ; base case
(check-expect (invader-landed? (cons I1 (cons (make-invader 10 10 10) (cons (make-invader 10 HEIGHT 90) empty)))) true)  ; returns true if landed invader is two-deep in list
(check-expect (invader-landed? (cons I1 (cons (make-invader 10 10 10) (cons (make-invader 10 100 90) empty)))) false)    ; returns false if no invader has landed
; (define (invader-landed? loi) false) ; stub
(define (invader-landed? loi)
  (cond [(empty? loi) false]
        [else (if (invader-landed2? (first loi))
                  true
                  (invader-landed? (rest loi)))]))


;; Invader -> Boolean
;; returns true if y coordinate of invader >= HEIGHT (i.e. invader has landed)
(check-expect (invader-landed2? (make-invader 0 (- HEIGHT 1) 10)) false)  ; invader right above ground ; not landed
(check-expect (invader-landed2? (make-invader 10 HEIGHT 10)) true)        ; invader just landed
(check-expect (invader-landed2? (make-invader 20 (+ HEIGHT 9) 10)) true)  ; invader past ground
; (define (invader-landed2? i) false) ; stub
(define (invader-landed2? invader)
  (>= (invader-y invader) HEIGHT))


;  ================================================================
;; control-tank and it's helper functions to control tank based on key presses

;; Game KeyEvent -> Game
;; Calls (go-left Tank) if left arrow key is pressed
;; Calls (go-right Tank) if right arrow key is pressed
;; Calls (shoot ListOfMissile Tank) if spacebar is pressed
; (define (control-tank g ke) G0) ; stub
(define (control-tank g ke)
  (cond [(key=? ke "left") (make-game (game-invaders g)
                                      (game-missiles g)
                                      (go-left (game-tank g)))]
        [(key=? ke "right") (make-game (game-invaders g)
                                       (game-missiles g)
                                       (go-right (game-tank g)))]
        [(key=? ke " ") (make-game (game-invaders g)
                                   (shoot (game-missiles g) (game-tank g))
                                   (game-tank g))]
        [else g]))


;; Tank -> Tank
;; Changes tank direction to -1
(check-expect (go-left (make-tank 20 1)) (make-tank 20 -1))   ; tank going right
(check-expect (go-left (make-tank 40 -1)) (make-tank 40 -1))  ; tank going left
;(define (go-left t) t) ; stub
(define (go-left t)
  (make-tank (tank-x t) -1))


;; Tank -> Tank
;; Changes tank direction to 1
(check-expect (go-right (make-tank 40 -1)) (make-tank 40 1)) ; tank going left
(check-expect (go-right (make-tank 60 1)) (make-tank 60 1))  ; tank going right
;(define (go-right t) t) ; stub
(define (go-right t)
  (make-tank (tank-x t) 1))


;; ListOfMissile Tank -> ListOfMissile
;; Adds a missile to ListOfMissile with y-coordiante of TANK-HEIGHT/2 and tank's x-cooridnate
(check-expect (shoot empty (make-tank 10 1)) (cons (make-missile 10 TANK-LINE) empty))                                         ; base case: empty list of missiles
(check-expect (shoot (cons M2 (cons M1 empty)) (make-tank 20 1)) (cons M2 (cons M1 (cons (make-missile 20 TANK-LINE) empty)))) ; adding missiles to existing list of missiles
;(define (shoot lom t) lom) ; stub
(define (shoot lom t)
  (cond [(empty? lom) (cons (make-missile (tank-x t) TANK-LINE) empty)]
        [else (cons (first lom)
                    (shoot (rest lom) t))]))

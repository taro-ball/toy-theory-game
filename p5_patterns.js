
helpMessage = [`<b>How to play:</b>

#️⃣ Use the grid at the bottom to present your answer.<br>
🕹️ Select a tile by clicking on it, then choose another tile to swap with. Repeat until you have arranged the tiles to match your guess.\
If you are correct, you will receive a win message. If not, you can reset the arrangement and try again. \
To view the result of your guess, click "Apply Map" Clicking 'Apply Map' again will reveal the original question.<br>`]

winMessages = [
    "You're a mastermind, a puzzle-solving wizard! 🔮🧩 Take a bow as the crowd goes wild and unicorns rain from the virtual sky! 🦄🌈",
    "Congratulations! You've unscrambled this puzzle faster than light! 🌟 But remember, according to Einstein, time is relative! 🕓⚛️",
    "Eureka! Archimedes would be proud of you. You've cracked the puzzle and upheld the principle of buoyancy! 🛁👏",
    "You've solved it, proving that the sum of your IQ is greater than ∞! ➕🧠=∞",
    "Puzzle: Solved! 🎉 You've brought order to this chaotic system. Take that, entropy! 🌌↩️",
    "You've conquered this puzzle like Newton conquering gravity! 🍏👑 Don't let the apple fall far from your wisdom tree!",
    "Well done! You've disproved uncertainty by locating both the puzzle's place and momentum! 🌠💡 Heisenberg would be perplexed!",
    "You've pieced together this puzzle like Schrödinger's cat in a superposition! 🐱📦🎉 Still alive and kicking!",
    "Well done! You've traversed through this maze like a photon in a double-slit experiment! 🎇💡 Truly enlightening!",
    "Incredible! You've tackled this puzzle like a Pythagorean theorem— a² + b² always equals victory²! 🎉📐",
    "You've broken through the puzzle barrier faster than the speed of sound! 🎊🔊 Mach you look good!",
    "Hats off to you! 🎩 You've vanquished this puzzle like Zeno's paradox— infinitely overcoming the halves to reach the goal! 🏁🐢",
    "Hurrah! You've filled this puzzle's gaps faster than a mathematician fills a number line! 📈➖➕=🥳",
    "You've solved this puzzle smoother than a perfectly rendered Bezier curve! 📈🎊 Designing success!",
    "Astonishing! You've pieced together this puzzle faster than Boltzmann distributing particles in a gas! ⚛️🎈",
    "Your resolution to this puzzle is more elegant than Euler's identity. e^(iπ)+1=0 now equals victory! 🎓🏅",
    "You've connected the puzzle pieces faster than the speed of light in a vacuum. c 🎉🔦 Here's to breaking no laws!",
    "Incredible! You've traversed the dimensions of this puzzle like a string theorist through multiverses! 🪐🎻",
    "Just as Fermat's Last Theorem stood no chance against Wiles, this puzzle stood no chance against you! 🎊🧮",
    "Well done! You've demonstrated the principle of causality by causing this puzzle to fall into place! 🪐➡️💫",
    "Puzzle: Solved! You've zeroed in on the solution as precisely as an atom's half-life in a radioactive sample! ☢️➡️⏳",
    "Stupendous! You've observed the puzzle solution, just like Bohr's model observing the quantum leaps of an electron! 🎊⚡️"
]
riddles = [{
    "targetMap": [0, 1, 2, 3, 4, 5, 10, 7, 8, 9, 6, 11, 12, 13, 14, 15],
    "boardPatterns": [
        [0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
        [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "name": "The easy one 😊",
    "author": "Human🙆"
},
{
    "targetMap": [0, 1, 2, 3, 4, 5, 10, 7, 8, 9, 6, 11, 12, 13, 14, 15],
    "boardPatterns": [
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
        [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1]
    ],
    "name": "Awesomeness of geometry📐",
    "author": "Robot🤖"
}, {
    "targetMap": [0, 1, 2, 3, 4, 5, 10, 7, 8, 9, 6, 11, 12, 13, 14, 15],
    "boardPatterns": [
        [0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
        [1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "name": "The easy one 😊",
    "author": "Human🙆"
},
{
    "targetMap": [15, 1, 2, 3, 4, 5, 10, 7, 8, 9, 6, 11, 12, 13, 14, 0],
    "boardPatterns": [
        [0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    "name": "Greener pastures 🌾🌾🌾",
    "author": "Bor🔰"
}

]
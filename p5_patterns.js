function riddleHint() {
    let hints = riddles[riddleIndex].hints;
    if (!hints || hints.length === 0) {
        return "Sorry, <b>no hints</b> here. You are on your own!";
    }

    let hint = hints[hintNo];
    hintNo = (hintNo + 1) % hints.length; // Increment hint index and reset to 0 after reaching the last hint
    
    return hint;
}

function gameLog(message) {
    let previousHtml = logDiv.html(); // get the current log
    logDiv.html(previousHtml + message + '<br><br>'); // append the new message and a newline
    logDiv.elt.scrollTop = logDiv.elt.scrollHeight; // scroll to the bottom
}

function inverseMapping(map) {
    let inverse = new Array(map.length);
    for (let i = 0; i < map.length; i++) {
        inverse[map[i]] = i;
    }
    return inverse;
}

function drawArrow(x, y, size) {
    //line(x, y, x, y + size);  // Vertical line
    line(x - size / 2, y + size / 2, x, y + size);  // Diagonal line left
    line(x + size / 2, y + size / 2, x, y + size);  // Diagonal line right
}

helpMessage = [`<b>How to play:</b>

#️⃣ Use the grid at the bottom to present your answer.

🕹️ Select a tile by clicking on it, then choose another tile to swap with. Repeat until you have arranged the tiles to match your guess.\
If you are correct, you will receive a win message. If not, you can reset the arrangement and try again. \
To view the result of your guess, click "Apply Map" Clicking 'Apply Map' again will reveal the original question.`]

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
    "targetMap": [2, 7, 0, 5, 6, 3, 4, 1, 8, 13, 10, 15, 12, 9, 14, 11],
    "boardPatterns": [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0]
    ],
    "name": "The Original🧩",
    "author": "Rob🧑‍🏫",
    "winMessage": "Impressive! You cracked it! 🥳🍾 (but Nitica was the first 😏🥇)",
}, {
    "targetMap": [0, 1, 2, 11, 4, 5, 6, 15, 8, 9, 10, 3, 12, 13, 14, 7],
    "boardPatterns": [
        [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0],
        [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1]
    ],
    "name": "The sweet one 🍭",
    "author": "Baker🧑‍🍳",
    "hints": ["Only involves tiles in the last column, but which ones?😏", "Ok, the top one is 11🦄.", "Still did not guess? Second from the top - 15🙄"]
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
    "author": "Robot🤖",
    "winMessage": "I am robot, you can not win me! Beep-beep-bup!",
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
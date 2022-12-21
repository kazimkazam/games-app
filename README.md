## Games Online App

Javascript (JS) static application that makes available 2 games that can be played on the browser;

The application is deployed and can be accessed through the link below:

## 

## Table of Contents

- [Development](#development);
- [Deployment](#deployment);
- [How to Use](#how-to-use);
- [Screenshots](#screenshots);
- [Future Work](#future-work);
- [Author](#author);
- [References](#references);
- [License](#licence).

## Development

This website was developed using JS and Phaser, a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers (https://newdocs.phaser.io/docs/3.55.2).

Additionally, it was used Howler. Howler is a audio library with easy implementation, and it was applied to add sound effects to Space Invaders.

The styling of the website was completed with the help from Bootstrap.

At the moment, the website allows you to play two games: Space Invaders and Tic-Tac-Toe.

The application uses the following packages:
- "bootstrap": "^5.2.3",
- "howler": "^2.2.3",
- "phaser": "^3.55.2",
- "sass": "^1.56.2"

### Tic-Tac-Toe

To control the computer next move choise it was applied the minimax algorithm, more specifically, the negamax search variant. Since Tic-Tac-Top is a relatively small game, i.e., with a relatively small number of possible choices which translates into a narrow tree of possibilities and relatively low branching factor (4), minimax algorithm is a perfect method to determine the best choice.

## Deployment



## How to Use

### Space Invaders

To start the game, just click on the game window. The game will start right away.

We know you don't like to waste bullets, so be careful, you'll only be able to fire while there is no other bullet of yours on the screen!

To maneuvre your spaceship, you'll need to use your arrow keys.

Use the space key to fire.

### Tic-Tac-Toe

When the page loads the first time, you are the first to play by default. To start, just click on the square where you wish to position your play.

In the case that you want to play after the computer, just change the setting 'First to play' above the window to 'Computer', and then click on 'New Game'.

We challenge you to beat the game while playing on difficulty 'Unbeatable'.

If you wish to play in a easier level, just change the difficulty to 'Easy'.

You will only need your mouse.

## Screenshots



## Future Work

The application has not yet been planned on how it should look on every screen size. So far, just planned how it should look on PC / Desktop and screens with width >= 800px. The main reason is that Space Invaders needs to be tweaked in order to work appropriately with smaller screen sizes and for the user to be able to play it without a keyboard.

There are also plans to include more games in the future. Namely, a chess game and game with tanks.

## Author

@kazimkazam (monsieurkazimkazam@gmail.com).

## References

- Spaceship icons created by Wendy-G - Flaticon (https://www.flaticon.com/free-icons/spaceship);
- Alien icons created by Freepik - Flaticon (https://www.flaticon.com/free-icons/alien);
- Explosion icons created by Smashicons - Flaticon (https://www.flaticon.com/free-icons/explosion);
- Game controller icons created by Freepik - Flaticon (https://www.flaticon.com/free-icons/game-controller);
- Fire icons created by Vectors Market - Flaticon (https://www.flaticon.com/free-icons/fire);
- Media fire icons created by Freepik - Flaticon (https://www.flaticon.com/free-icons/media-fire);
- Sound Effect from Pixabay (https://pixabay.com/sound-effects/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=14800);
- Circle icons created by Freepik - Flaticon (https://www.flaticon.com/free-icons/circle);
- Cross icons created by Freepik - Flaticon (https://www.flaticon.com/free-icons/cross).

## Licence

MIT
# Missile Defender

Project for Mobile Game class

Short description: The player will control a vehicle with a cannon. The vehicle will be at the bottom of the screen. The player's task is to destroy bombs falling from the top of the screen and destroy enemy planes flying at the top of the screen, from the left to the right edge of the screen. Enemy planes regularly drop bombs. The player scores points after destroying a bomb or enemy aircraft. In case the bomb hits the player, the game is over. If the player misses the bomb and it touches the ground, the player loses some hit points. When these drop to 0, the game is over. The game has just 1 level, but after some time it becomes more and more difficult - planes and bombs move faster and there are more of them. The game has bonuses in the form of shields, weapon buffs, and hit points renewal. In addition, the player earns gold for destroying the enemy, which can be spent on upgrading their weapons permanently (shooting speed, movement speed). At the beginning of the game, the shooting speed is limited.

UI description: Graphics in the game will be realistic type. The player will be able to move his vehicle horizontally (using the accelerometer), to use weapons, or special weapons (if available), the player will use the buttons on the screen. The player will earn points and gold to upgrade their weapons by destroying falling bombs and flying enemy planes. When the bomb hits the ground or the player loses, the phone will shake.

High-score will be stored in cloud data-source (Firestore) after gameover.

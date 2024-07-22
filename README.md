# CS 2: Utility waste calculator
A node project to calculate how much money you wasted on utility gear

## What?!
Do you have teamates that always die with unused utility in their inventories?  
Now it's time to know excatly how much of the team economy they really screwed up.

## How?
It's really simple  
- 0) have [node](https://nodejs.org/pt/download/package-manager) intalled and configured on your computer
- 1) go to your steam match history [here](https://steamcommunity.com/my/gcpd/730?tab=matchhistorypremier)
- 2) download the replay you want to analyse
- 3) right click on it and extract
- 4) place the extracted .dem file inside "demos" folder in this repository
- 5) at main.js, put the name of your file on the variable `filePath` (line 3)
- 6) open a terminal and run `node main.js`
- 7) enjoy:  
![image](https://github.com/diguifi/cs2-utility-waste-calculator/assets/31022286/fdbbdf65-3d0c-435b-9dcc-f0279207626d)


## I don't get it
Basically now you know exactly how much money was spent on utility and how much of it was wasted (because the player died with certain unused amount in their inventory) on the entire match and now you can shove this on your friend's face and say he'll never receive a drop unless they learn how to spend money on utility.


## Known issues
- doesn't properly consider utilities picked from the ground

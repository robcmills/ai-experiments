
*Entry 1*

*Sun Nov 15, 2020*

I began with https://github.com/alenaksu/neatjs, a javascript implementation of Kenneth Stanley's
NEAT algorithm. I studied this codebase and began a rewrite in a branch of this repo. I made
several changes to the core classes as I saw fit and wrote a few unit tests to make sure things
were working. But then I got mired in some difficult bugs that introduced into some of the
more complex methods, and I wasn't even sure if they were working in the first place. I
timeboxed my efforts and eventually abandoned that branch after looking again a bit closer
at https://github.com/wagenaartje/neataptic. This repo appeared to be laid out more
sensibly, was better documented, and a few good example usages existed, such as
https://github.com/wagenaartje/target-seeking-ai.

I started another branch and set up a basic implementation of a Game class that ran a simple
 simulation of a population created by neataptic. Every Player would spawn in the middle of a
  canvas (x:0,y:0) and then activate its network with the following inputs:
  
```tsx
class Player {
  step() {
    const inputs = [
      health.position.x,
      health.position.y,
      health.amount,
      this.position.x,
      this.position.y,
    ];
    const [velocityX, velocityY] = this.network.activate(inputs);
```

Where one `health` would be spawned randomly on the canvas somewhere. When a player's position
 got close enough to the position of the health, that player's health would incease. Each step of
  the simulation every player's health would decrement by one, or if a player moved out-of-bounds
   their health would immediately be set to zero, effectively killing them. The goal here being
    to evolve players that seek the health, basic target acquisition.
    
Before attempting to evolve, I would mutate the original population 100 times and then just run
 the simulation and render the paths of 100 players to seed with some variety. The following
  screenshots depict those initial experiments. You can see that with only 100 mutations of a
   simple network with 5 inputs and 2 outputs it produced a somewhat interesting assortment of
    movement behaviors:
    
 ![initial-mutated-seed-populations](https://i.imgur.com/wk3j6jh.png)
    
 Then I set about evolving the population, whereby each players fitness, or score, would be its
  health minus its distance to the health. Thus those players who got closer would be rewarded
   and those who got close enough would be rewarded more (by acquisition of the health).
   
 With only 1000 rounds of evolution this usually yielded a decent champion that would move closer
  to the target health, as depicted in the following screenshots:
  
 ![initial-evolved-behavior](https://i.imgur.com/pRfafmG.png)

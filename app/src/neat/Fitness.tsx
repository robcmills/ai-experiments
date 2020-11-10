import { Network } from 'neat/Network';
import { Organism } from 'neat/Organism';
import { Population } from 'neat/Population';

export type Fitness = (args: {
  network: Network;
  organism: Organism;
  population: Population;
}) => number;

import { getInnovator, Innovator } from 'util/innovator';

export interface INeatParams {
  addConnectionTries: number; // Number of attempts to find an open link
  adjustCompatibilityThreshold: boolean; // Whether to adjust the threshold used to compute compatibility
  ageSignificance: number; // Fitness boost for young ages (less than 10)
  compatibilityModifier: number; // Compatibility threshold modifier for each generation. Set to 0 to disable.
  compatibilityModifierTarget: number; // Number of species to increase/decrease the compatibility threshold
  compatibilityThreshold: number; // Threshold to consider two species different
  disjointCoefficient: number; // Disjoint coefficient used to compute compatibility
  dropoffAge: number; // When Species starts to be penalized
  excessCoefficient: number; // Excess coefficient used to compute compatibility
  feedForwardOnly: boolean; // If true, only feed-forward networks are allowed
  fitnessThreshold: number; // Threshold to consider the network valid
  genomeWeightPerturbed: number; // Chance for genome weight to be uniformly perturbed
  innovator: Innovator;
  interSpeciesMateRate: number; // Probability of a mate being outside species
  mutateAddConnectionProbability: number; // Probability of an "add connection" mutation
  mutateAddNodeProbability: number; // Probability of an "add node" mutation
  mutateConnectionWeightsProbability: number; // Probability for genome to have its weights mutated
  mutateOnlyProbability: number; // Probability of a non-mating reproduction
  mutateToggleEnableProbability: number; // Probability of a genome being toggled
  mutationPower: number; // The power of a connection weight mutation
  populationSize: number; // Size of population
  reEnableGeneProbability: number; // Probability for a disabled connection to be re-enabled
  survivalThreshold: number; // Percent of average fitness for survival
  weightDifferenceCoefficient: number; // Weight difference coefficient used to compute compatibility
}

export const defaultNeatParams: INeatParams = {
  addConnectionTries: 20,
  adjustCompatibilityThreshold: false,
  ageSignificance: 1,
  compatibilityModifier: 0.3,
  compatibilityModifierTarget: 10,
  compatibilityThreshold: 3.0,
  disjointCoefficient: 1.0,
  dropoffAge: 15,
  excessCoefficient: 1.0,
  feedForwardOnly: true,
  fitnessThreshold: 0.9,
  genomeWeightPerturbed: 0.9,
  innovator: getInnovator(),
  interSpeciesMateRate: 0.001,
  mutateAddConnectionProbability: 0.05,
  mutateAddNodeProbability: 0.03,
  mutateConnectionWeightsProbability: 0.9,
  mutateOnlyProbability: 0.2,
  mutateToggleEnableProbability: 0,
  mutationPower: 2.5,
  populationSize: 100,
  reEnableGeneProbability: 0.05,
  survivalThreshold: 0.2,
  weightDifferenceCoefficient: 1,
};

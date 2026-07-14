import { registerAppRoot } from './app.js';
import { registerLearn } from './learn.js';
import { registerQuiz } from './quiz.js';
import { registerParent } from './parent.js';

export function registerComponents(Alpine) {
  registerAppRoot(Alpine);
  registerLearn(Alpine);
  registerQuiz(Alpine);
  registerParent(Alpine);
}

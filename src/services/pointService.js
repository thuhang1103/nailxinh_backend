const rewards = [
  { points: 10, weight: 20 },
  { points: 50, weight: 20 },
  { points: 100, weight: 30 },
  { points: 200, weight: 20 },
  { points: 500, weight: 10 }
];

function randomReward() {
  const totalWeight = rewards.reduce((s, r) => s + r.weight, 0);
  const rand = Math.floor(Math.random() * totalWeight) + 1;

  let sum = 0;
  for (const r of rewards) {
    sum += r.weight;
    if (rand <= sum) return r.points;
  }
}

module.exports = { randomReward };
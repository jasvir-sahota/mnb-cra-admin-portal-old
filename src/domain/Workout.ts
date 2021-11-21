type Workout = {
  stretching: string,
  day: string,
  set: number,
  rep: number,
  excercise: string,
  instructions: string,
  tempo: string,
  rest: string
}

type WorkoutPlan = {
  id: string,
  name: string,
  items: Workout[] | []
}

type WorkoutSchedule = {
  id: string,
  start_date: string,
  end_date: string,
  notes: string[],
  plan: WorkoutPlan
}

export type {
  Workout,
  WorkoutPlan,
  WorkoutSchedule
}
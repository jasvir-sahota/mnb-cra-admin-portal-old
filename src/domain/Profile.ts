export class Profile {
  height: number;
  weight: number;
  heart_rate: number;
  chest: number;
  arms: number;
  bicep: number;
  body_metric: number;
  sleep_hours: number;

  constructor(json: string) {
    const obj = JSON.parse(json);

    const {
      heart_rate,
      height,
      weight,
      chest,
      arms,
      bicep,
      body_metric,
      sleep_hours,
    } = obj;

    this.arms = arms;
    this.height = height;
    this.bicep =  bicep;
    this.body_metric = body_metric;
    this.chest = chest;
    this.heart_rate = heart_rate;
    this.weight = weight;
    this.sleep_hours = sleep_hours;
  }
}
export interface IRatingRequest {
  rate: number;
  comment: string;
  userId: string;
}

export interface IRatingInvalid extends IRatingRequest {
  invalidField: any;
}
